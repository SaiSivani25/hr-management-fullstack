# Company Routes Module
# Handles all CRUD operations for companies table in BigQuery

import re
from typing import List

from config.bigquery import client, dataset
from fastapi import APIRouter, HTTPException, status
from google.cloud import bigquery
from models.company import Company

# Create router instance for company endpoints
router = APIRouter()

# Table name in BigQuery
COMPANIES_TABLE = "company_details"


@router.get("/companies", response_model=List[Company])
async def get_all_companies():
    """
    GET /api/companies
    Fetch all company records from the company_details table

    Returns:
        List of Company objects
    """
    try:
        # Query to fetch all companies
        query = (
            f"SELECT * FROM `{dataset.project}.{dataset.dataset_id}.{COMPANIES_TABLE}`"
            f" ORDER BY company_id ASC"
        )
        query_job = client.query(query)
        results = query_job.result()

        # Convert results to Company models
        companies = [Company(**dict(row)) for row in results]
        return companies
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching companies: {str(e)}",
        )


@router.post("/companies", response_model=Company, status_code=status.HTTP_201_CREATED)
async def create_company(company: Company):
    """
    POST /api/companies
    Insert a new company record into the company_details table

    Parameters:
        company: Company object with all required fields

    Returns:
        The created Company object
    """
    if not re.match(r'^[a-zA-Z\s]+$', company.company_name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company name must contain only letters")
    if not re.match(r'^[a-zA-Z\s]+$', company.industry):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Industry must contain only letters")
    if company.employee_count <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee count must be a positive number")
    if company.annual_revenue <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Annual revenue must be a positive number")
    try:
        insert_query = f"""
    INSERT INTO `{dataset.project}.{dataset.dataset_id}.{COMPANIES_TABLE}`
    (company_id, company_name, industry, employee_count, annual_revenue)
    VALUES (@company_id, @company_name, @industry,
            @employee_count, @annual_revenue)
"""
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "company_id", "STRING", company.company_id
                ),
                bigquery.ScalarQueryParameter(
                    "company_name", "STRING", company.company_name
                ),
                bigquery.ScalarQueryParameter("industry", "STRING", company.industry),
                bigquery.ScalarQueryParameter(
                    "employee_count", "INT64", company.employee_count
                ),
                bigquery.ScalarQueryParameter(
                    "annual_revenue", "FLOAT64", company.annual_revenue
                ),
            ]
        )
        client.query(insert_query, job_config=job_config).result()

        return company
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating company: {str(e)}",
        )


@router.put("/companies/{company_id}", response_model=Company)
async def update_company(company_id: str, company: Company):
    """
    PUT /api/companies/{id}
    Update an existing company record by company_id

    Parameters:
        company_id: ID of the company to update
        company: Updated Company object

    Returns:
        The updated Company object
    """
    if not re.match(r'^[a-zA-Z\s]+$', company.company_name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company name must contain only letters")
    if not re.match(r'^[a-zA-Z\s]+$', company.industry):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Industry must contain only letters")
    if company.employee_count <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee count must be a positive number")
    if company.annual_revenue <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Annual revenue must be a positive number")
    try:
        # Delete existing row with this company_id
        delete_query = f"""
        DELETE FROM `{dataset.project}.{dataset.dataset_id}.{COMPANIES_TABLE}`
        WHERE company_id = @company_id
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("company_id", "STRING", company_id)
            ]
        )
        client.query(delete_query, job_config=job_config).result()

        # Insert updated row
        rows_to_insert = [company.dict()]
        table = client.get_table(
            f"{dataset.project}.{dataset.dataset_id}.{COMPANIES_TABLE}"
        )
        errors = client.insert_rows_json(table, rows_to_insert)

        if errors:
            raise Exception(f"Update errors: {errors}")

        return company
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating company: {str(e)}",
        )


@router.delete("/companies/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: str):
    """
    DELETE /api/companies/{id}
    Delete a company record by company_id

    Parameters:
        company_id: ID of the company to delete
    """
    try:
        # Delete query
        delete_query = f"""
        DELETE FROM `{dataset.project}.{dataset.dataset_id}.{COMPANIES_TABLE}`
        WHERE company_id = @company_id
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("company_id", "STRING", company_id)
            ]
        )
        client.query(delete_query, job_config=job_config).result()

        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting company: {str(e)}",
        )
