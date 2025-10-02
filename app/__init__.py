"""
BROWSEEASE Application Package
"""

# Import core modules
from fastapi import FastAPI
from dotenv import load_dotenv

# Load environment variables at application startup
load_dotenv()

# Create the FastAPI application
app = FastAPI(
    title="BROWSEEASE API",
    description="Backend API for BROWSEEASE application",
    version="0.1.0"
)

# Import routes
from app.api import router as api_router

# Register routes
app.include_router(api_router, prefix="/api")