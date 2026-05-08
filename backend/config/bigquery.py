# BigQuery Configuration Module
# Initializes BigQuery client and loads configuration from environment variables

import os

from dotenv import load_dotenv
from google.cloud import bigquery

# Load environment variables from .env file
load_dotenv()

# Get configuration from environment variables
PROJECT_ID = os.getenv("GCP_PROJECT_ID")
DATASET_ID = os.getenv("BIGQUERY_DATASET")

# Initialize BigQuery client with credentials from GOOGLE_APPLICATION_CREDENTIALS
client = bigquery.Client(project=PROJECT_ID)

# Get dataset reference
dataset_ref = client.dataset(DATASET_ID)
dataset = client.get_dataset(dataset_ref)

# Export client and dataset for use in other modules
__all__ = ["client", "dataset", "PROJECT_ID", "DATASET_ID"]
