# Employee Routes Module
# Handles all CRUD operations for employees table in BigQuery

import re
from typing import List

from config.bigquery import client, dataset
from fastapi import APIRouter, HTTPException, status
from google.cloud import bigquery
from models.employee import Employee

# Create router instance for employee endpoints
router = APIRouter()

# Table name in BigQuery
EMPLOYEES_TABLE = "employees"


@router.get("/employees", response_model=List[Employee])
async def get_all_employees():
    """
    GET /api/employees
    Fetch all employee records from the employees table

    Returns:
        List of Employee objects
    """
    try:
        # Query to fetch all employees
        query = (
            f"SELECT * FROM `{dataset.project}.{dataset.dataset_id}.{EMPLOYEES_TABLE}`"
            f" ORDER BY employee_id ASC"
        )
        query_job = client.query(query)
        results = query_job.result()

        # Convert results to Employee models
        employees = [Employee(**row) for row in results]
        return employees
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching employees: {str(e)}",
        )


@router.post("/employees", response_model=Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: Employee):
    """
    POST /api/employees
    Insert a new employee record into the employees table

    Parameters:
        employee: Employee object with all required fields

    Returns:
        The created Employee object
    """
    if not re.match(r'^[a-zA-Z\s]+$', employee.full_name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Full name must contain only letters")
    if not re.match(r'^[a-zA-Z\s]+$', employee.department):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department must contain only letters")
    if not re.match(r'^[a-zA-Z\s]+$', employee.job_title):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job title must contain only letters")
    if employee.salary <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Salary must be a positive number")
    company_check = client.query(
        f"SELECT company_id FROM `{dataset.project}.{dataset.dataset_id}.company_details`"
        f" WHERE company_id = @company_id LIMIT 1",
        job_config=bigquery.QueryJobConfig(query_parameters=[
            bigquery.ScalarQueryParameter("company_id", "STRING", employee.company_id)
        ])
    ).result()
    if company_check.total_rows == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company ID does not exist")
    try:
        insert_query = f"""
    INSERT INTO `{dataset.project}.{dataset.dataset_id}.{EMPLOYEES_TABLE}`
    (employee_id, full_name, email, department, job_title, salary, company_id)
    VALUES (@employee_id, @full_name, @email,
            @department, @job_title, @salary, @company_id)
"""
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "employee_id", "STRING", employee.employee_id
                ),
                bigquery.ScalarQueryParameter(
                    "full_name", "STRING", employee.full_name
                ),
                bigquery.ScalarQueryParameter("email", "STRING", employee.email),
                bigquery.ScalarQueryParameter(
                    "department", "STRING", employee.department
                ),
                bigquery.ScalarQueryParameter(
                    "job_title", "STRING", employee.job_title
                ),
                bigquery.ScalarQueryParameter("salary", "FLOAT64", employee.salary),
                bigquery.ScalarQueryParameter(
                    "company_id", "STRING", employee.company_id
                ),
            ]
        )
        client.query(insert_query, job_config=job_config).result()

        return employee
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating employee: {str(e)}",
        )


@router.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(employee_id: str, employee: Employee):
    """
    PUT /api/employees/{id}
    Update an existing employee record by employee_id

    Parameters:
        employee_id: ID of the employee to update
        employee: Updated Employee object

    Returns:
        The updated Employee object
    """
    if not re.match(r'^[a-zA-Z\s]+$', employee.full_name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Full name must contain only letters")
    if not re.match(r'^[a-zA-Z\s]+$', employee.department):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department must contain only letters")
    if not re.match(r'^[a-zA-Z\s]+$', employee.job_title):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job title must contain only letters")
    if employee.salary <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Salary must be a positive number")
    company_check = client.query(
        f"SELECT company_id FROM `{dataset.project}.{dataset.dataset_id}.company_details`"
        f" WHERE company_id = @company_id LIMIT 1",
        job_config=bigquery.QueryJobConfig(query_parameters=[
            bigquery.ScalarQueryParameter("company_id", "STRING", employee.company_id)
        ])
    ).result()
    if company_check.total_rows == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company ID does not exist")
    try:
        # Update query - replace entire row matching employee_id
        update_query = f"""
        DELETE FROM `{dataset.project}.{dataset.dataset_id}.{EMPLOYEES_TABLE}`
        WHERE employee_id = @employee_id
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("employee_id", "STRING", employee_id)
            ]
        )
        client.query(update_query, job_config=job_config).result()

        # Insert updated row
        rows_to_insert = [employee.dict()]
        table = client.get_table(
            f"{dataset.project}.{dataset.dataset_id}.{EMPLOYEES_TABLE}"
        )
        errors = client.insert_rows_json(table, rows_to_insert)

        if errors:
            raise Exception(f"Update errors: {errors}")

        return employee
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating employee: {str(e)}",
        )


@router.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    """
    DELETE /api/employees/{id}
    Delete an employee record by employee_id

    Parameters:
        employee_id: ID of the employee to delete
    """
    try:
        # Delete query
        delete_query = f"""
        DELETE FROM `{dataset.project}.{dataset.dataset_id}.{EMPLOYEES_TABLE}`
        WHERE employee_id = @employee_id
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("employee_id", "STRING", employee_id)
            ]
        )
        client.query(delete_query, job_config=job_config).result()

        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting employee: {str(e)}",
        )
