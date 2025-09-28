"""
Configuration module for BROWSEEASE application.
Centralizes access to environment variables and configuration settings.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# LLM Configuration
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "llama2")
LLM_MODEL = os.getenv("LLM_MODEL", "llama2-7b")

# Application Settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Database Configuration
DB_CONNECTION_STRING = os.getenv("DB_CONNECTION_STRING", "sqlite:///./app.db")