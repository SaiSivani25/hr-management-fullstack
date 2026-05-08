# Employee Model Module
# Defines Pydantic model for Employee with validation

from pydantic import BaseModel, Field


class Employee(BaseModel):
    """
    Pydantic model for Employee data validation

    Fields:
    - employee_id: Unique identifier for employee
    - full_name: Full name of the employee
    - email: Email address of the employee
    - department: Department where employee works
    - job_title: Job title/position of the employee
    - salary: Annual salary of the employee
    - company_id: ID of the company employee works for
    """

    employee_id: str = Field(..., description="Unique employee identifier")
    full_name: str = Field(..., description="Full name of the employee")
    email: str = Field(..., description="Email address")
    department: str = Field(..., description="Department name")
    job_title: str = Field(..., description="Job title/position")
    salary: float = Field(..., description="Annual salary")
    company_id: str = Field(..., description="Company identifier")

    class Config:
        # Schema for API documentation
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john@example.com",
                "department": "Engineering",
                "job_title": "Software Engineer",
                "salary": 95000.0,
                "company_id": "COMP001",
            }
        }
