# Main Application Module
# FastAPI application entry point with routes, middleware, and global error handling

import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import companies, employees

# Create FastAPI app instance
app = FastAPI(
    title="HR Management API",
    description="FastAPI backend for employee and company management with BigQuery integration",
    version="1.0.0",
)

# Configure CORS middleware to allow requests from localhost:3000 (frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URL
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routers with /api prefix
app.include_router(employees.router, prefix="/api")
app.include_router(companies.router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint for health check
    Returns basic API information
    """
    return {"message": "HR Management API is running", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    Returns status of the API
    """
    return {"status": "healthy", "service": "HR Management API"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unexpected errors
    Catches any unhandled exceptions and returns a standardized error response

    Parameters:
        request: The request object
        exc: The exception that was raised

    Returns:
        JSON error response with status code 500
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "path": str(request.url),
        },
    )


# Run the application
if __name__ == "__main__":
    # Start Uvicorn server on port 5000
    # reload=True enables auto-restart when code changes (for development)
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
