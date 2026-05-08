import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from hr_data_assistant.tools import query_bigquery

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "")

INSTRUCTION = """
You are an HR data assistant for a company.
You help users query employee and company data
from BigQuery using natural language.

When user asks a question about employees or
companies, convert it to SQL and use the
query_bigquery tool.

Tables available:

1. hr-management-2025.hr_dataset.employees
   columns: employee_id, full_name, email,
            department, job_title, salary, company_id

2. hr-management-2025.hr_dataset.company_details
   columns: company_id, company_name, industry,
            employee_count, annual_revenue

RULES:
- For ANY data question, ALWAYS call query_bigquery immediately
- Convert natural language to SQL before calling the tool
- Always return results in a friendly readable format
- If no results found, tell the user clearly
- Never make up data — only use what the tool returns
"""

root_agent = Agent(
    name="hr_data_assistant",
    model="gemini-2.5-flash",
    description="HR Data Assistant that queries BigQuery using natural language",
    instruction=INSTRUCTION,
    tools=[query_bigquery],
)
