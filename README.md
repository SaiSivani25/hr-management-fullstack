# HR Management Full Stack Application

## Overview
A full-stack HR Management System built with:
- **Backend**: Python FastAPI
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: Google BigQuery (GCP)
- **AI Agent**: Google ADK + Gemini 2.5 Flash

## Project Structure

    hr-management-fullstack/
    ├── backend/
    │   ├── config/
    │   ├── models/
    │   ├── routes/
    │   ├── main.py
    │   ├── requirements.txt
    │   └── Dockerfile
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── services/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── package.json
    │   └── vite.config.js
    └── hr-agent/
        ├── hr_data_assistant/
        │   ├── agent.py
        │   └── tools.py
        ├── requirements.txt
        └── Dockerfile

## Features
- Employee management (Add, Edit, Delete, Search)
- Company management (Add, Edit, Delete, Search)
- Data validation on both frontend and backend
- Connected to Google BigQuery database
- AI-powered natural language queries via HR Agent


## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| Database | Google BigQuery |
| AI Agent | Google ADK, Gemini 2.5 Flash |
| Deployment | Google Cloud Run |
| Version Control | GitHub |

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Cloud SDK
- GCP Account with BigQuery enabled

### Backend Setup
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

### Frontend Setup
```
cd frontend
npm install
npm run dev
```

### HR AI Agent Setup
```
cd hr-agent
pip install -r requirements.txt
adk web hr-agent
```

## Environment Variables

### Backend (.env)
```
GCP_PROJECT_ID=your-project-id
BIGQUERY_DATASET=hr_dataset
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

### HR Agent (.env)
```
GOOGLE_API_KEY=your-gemini-api-key
GCP_PROJECT_ID=your-project-id
BIGQUERY_DATASET=hr_dataset
GOOGLE_APPLICATION_CREDENTIALS=../backend/credentials.json
```

## API Endpoints

### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/employees | Get all employees |
| POST | /api/employees | Create employee |
| PUT | /api/employees/{id} | Update employee |
| DELETE | /api/employees/{id} | Delete employee |

### Companies
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/companies | Get all companies |
| POST | /api/companies | Create company |
| PUT | /api/companies/{id} | Update company |
| DELETE | /api/companies/{id} | Delete company |

## Database Schema

### employees table
| Column | Type |
|---|---|
| employee_id | STRING |
| full_name | STRING |
| email | STRING |
| department | STRING |
| job_title | STRING |
| salary | FLOAT |
| company_id | STRING |

### company_details table
| Column | Type |
|---|---|
| company_id | STRING |
| company_name | STRING |
| industry | STRING |
| employee_count | INTEGER |
| annual_revenue | FLOAT |
