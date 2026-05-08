import os
import json
import tempfile
from google.cloud import bigquery, secretmanager
from dotenv import load_dotenv

load_dotenv()


def get_bigquery_client():
    credentials_path = os.path.join(
        os.path.dirname(__file__),
        "../../backend/credentials.json"
    )

    if os.path.exists(credentials_path):
        return bigquery.Client.from_service_account_json(
            credentials_path,
            project=os.getenv("GCP_PROJECT_ID")
        )
    else:
        secret_client = secretmanager.SecretManagerServiceClient()
        secret_name = f"projects/{os.getenv('GCP_PROJECT_ID')}/secrets/bigquery-credentials/versions/latest"
        response = secret_client.access_secret_version(name=secret_name)
        secret_data = json.loads(response.payload.data.decode("UTF-8"))

        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(secret_data, f)
            temp_path = f.name

        client = bigquery.Client.from_service_account_json(
            temp_path,
            project=os.getenv("GCP_PROJECT_ID")
        )
        os.unlink(temp_path)
        return client


def query_bigquery(sql_query: str) -> str:
    """
    Executes a SQL query on BigQuery and returns the results as a formatted string.

    Args:
        sql_query: The SQL query to run against BigQuery.

    Returns:
        Query results as a formatted string, or a message if no results found.
    """
    client = get_bigquery_client()
    query_job = client.query(sql_query)
    results = query_job.result()

    rows = list(results)
    if not rows:
        return "No results found."

    lines = []
    for row in rows:
        lines.append(", ".join(f"{k}: {v}" for k, v in dict(row).items()))
    return "\n".join(lines)
