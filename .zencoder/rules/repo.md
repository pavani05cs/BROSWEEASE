---
description: Repository Information Overview
alwaysApply: true
---

# BROWSEEASE Information

## Summary

BROWSEEASE is a Web Navigator AI Agent that takes natural language instructions and autonomously browses the web on a local computer. It understands queries like "search for laptops under 50k and compare top 5," drives a browser to collect information from multiple sites, and returns structured, actionable results.

## Structure

- **app/**: Backend Python application with FastAPI
  - **api/**: API routes and endpoints
  - **cache/**: Caching mechanism
  - **llm/**: LLM integration (Llama2)
  - **scraper/**: Web scraping functionality
  - **utils/**: Utility functions
- **frontend/**: React TypeScript frontend
  - **src/**: Source code with components, hooks, and pages
  - **public/**: Static assets
- **logs/**: Application logs
- **.venv/**: Python virtual environment

## Language & Runtime

**Backend Language**: Python
**Frontend Language**: TypeScript
**Build System**: Vite (frontend)
**Package Managers**: pip (backend), npm (frontend)

## Dependencies

### Backend Dependencies

**Main Dependencies**:

- fastapi==0.104.1
- uvicorn==0.23.2
- websockets==11.0.3
- playwright==1.39.0
- llama-cpp-python==0.2.11
- transformers==4.34.1
- torch==2.1.0
- pandas==2.1.1
- sqlalchemy==2.0.22

**Development Dependencies**:

- python-dotenv==1.0.0
- loguru==0.7.2

### Frontend Dependencies

**Main Dependencies**:

- react==18.3.1
- react-dom==18.3.1
- react-router-dom==6.30.1
- @tanstack/react-query==5.83.0
- tailwindcss-animate==1.0.7
- zod==3.25.76

**Development Dependencies**:

- typescript==5.8.3
- vite==5.4.19
- tailwindcss==3.4.17
- eslint==9.32.0

## Build & Installation

### Backend

```bash
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app:app --reload
```

### Frontend

```bash
# Install dependencies
cd frontend
npm install

# Development server
npm run dev

# Build for production
npm run build
```

## Testing

**Backend Framework**: Not specified in available files
**Frontend Framework**: Not specified in available files
