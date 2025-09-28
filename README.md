# BROWSEEASE

## Environment Setup

This project uses environment variables to manage sensitive information like API keys. Follow these steps to set up your environment:

1. Copy the `.env.example` file to a new file named `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and add your actual API keys and configuration:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. Never commit your `.env` file to the repository - it's already in the `.gitignore` file.

## Running the Application

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Start the backend server:
   ```
   python -m uvicorn app.main:app --reload
   ```

3. In a separate terminal, start the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```