# Company Model Module
# Defines Pydantic model for Company with validation

from pydantic import BaseModel, Field


class Company(BaseModel):
    """
    Pydantic model for Company data validation

    Fields:
    - company_id: Unique identifier for company
    - company_name: Name of the company
    - industry: Industry sector the company operates in
    - employee_count: Total number of employees
    - annual_revenue: Annual revenue of the company
    """

    company_id: str = Field(..., description="Unique company identifier")
    company_name: str = Field(..., description="Name of the company")
    industry: str = Field(..., description="Industry sector")
    employee_count: int = Field(..., description="Total number of employees")
    annual_revenue: float = Field(..., description="Annual revenue")

    class Config:
        # Schema for API documentation
        json_schema_extra = {
            "example": {
                "company_id": "COMP001",
                "company_name": "Tech Solutions Inc",
                "industry": "Technology",
                "employee_count": 500,
                "annual_revenue": 50000000.0,
            }
        }
