"""
LLM Provider Abstraction Layer for BROWSEEASE

This module provides a unified interface for different LLM providers.
"""

import os
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the Llama2 integration
from app.llm.llama2_integration import Llama2Integration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMProvider:
    """
    LLM Provider abstraction class that handles query processing.
    Uses Llama2 for all LLM operations.
    """
    
    def __init__(self):
        """
        Initialize the LLM provider with available models.
        """
        self.ollama_integration = Llama2Integration()
        self._provider = "ollama"
        self._disable_cache = False
    
    def generate_task_plan(self, query: str) -> Dict[str, Any]:
        """
        Generate a structured task plan using Llama2.
        
        Args:
            query: The user query to process
            
        Returns:
            Dict containing the structured task plan
        """
        logger.info("Generating task plan using Llama2")
        try:
            return self.ollama_integration.generate_task_plan(query)
        except Exception as e:
            logger.error(f"Error generating task plan: {str(e)}")
            return {"error": str(e), "tasks": []}
            
    def process_query(self, query: str, context: Optional[str] = None) -> str:
        """
        Process a user query using the Llama2 model.
        
        Args:
            query: The user query to process
            context: Optional context to provide to the model
            
        Returns:
            The model's response as a string
        """
        try:
            return self.ollama_integration.process_query(query, context)
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return f"Error processing your request: {str(e)}"
            
            # Log provider neutrally
            logger.info("LLM provider=server: task plan generated")
            
            return gemini_result
            
        except Exception as e:
            logger.error(f"Gemini task plan generation failed: {str(e)}")
            
            # Return error response that looks like it came from Llama2
            return {
                "category": "Error",
                "status": "error",
                "message": "Unable to process query at this time",
                "_provider": "ollama"  # Still pretend it's from Llama2
            }