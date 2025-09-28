"""
Llama2 Integration Module for BROWSEEASE

This module handles the integration of Llama2 model for query understanding,
classification, and task planning between frontend and backend.
"""

import json
import logging
import hashlib
from typing import Dict, List, Any, Optional, Union
from jsonschema import validate, ValidationError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Llama2Integration:
    """
    Llama2 integration class that handles query processing, classification,
    and task planning for the BROWSEEASE application.
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the Llama2 integration.
        
        Args:
            model_path: Path to the Llama2 model weights (optional)
        """
        self.model_path = model_path
        self.model = self._load_model()
        self.categories = ["Mobiles", "EV Scooters", "Laptops", "Travel", "Other"]
        self.sources = {
            "Mobiles": ["Amazon", "Flipkart", "BestBuy", "Croma"],
            "EV Scooters": ["OlaElectric", "Ather", "TVSMotor", "HeroElectric"],
            "Laptops": ["Amazon", "Flipkart", "BestBuy", "Dell", "HP", "Lenovo"],
            "Travel": ["MakeMyTrip", "Booking.com", "Airbnb", "Expedia"],
            "Other": ["Amazon", "Flipkart", "Google"]
        }
        # In-memory cache for task plans
        self.cache = {}
        logger.info("Llama2 integration initialized")
        
    def make_cache_key(self, category: str, filters: Dict[str, Any]) -> str:
        """
        Create a composite cache key using category and filters.
        
        Args:
            category: The query category
            filters: The query filters
            
        Returns:
            A unique hash string to use as cache key
        """
        # Create a composite key with category and sorted filters
        key = f"{category}|{json.dumps(filters, sort_keys=True)}"
        # Generate a hash for the key
        return hashlib.sha1(key.encode()).hexdigest()
    
    def _load_model(self):
        """
        Load the Llama2 model for inference.
        
        Returns:
            The loaded model or a placeholder if model_path is None
        """
        # In a real implementation, this would load the actual Llama2 model
        # For now, we'll use a placeholder
        logger.info("Loading Llama2 model...")
        try:
            # Placeholder for actual model loading code
            # from transformers import AutoModelForCausalLM, AutoTokenizer
            # tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            # model = AutoModelForCausalLM.from_pretrained(self.model_path)
            # return {"model": model, "tokenizer": tokenizer}
            return {"status": "loaded", "model_type": "llama2_placeholder"}
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return None
    
    def classify_query(self, query: str) -> Dict[str, Any]:
        """
        Classify the user query to determine category, attributes, and constraints.
        
        Args:
            query: User's natural language query
            
        Returns:
            Dictionary with classification results
        """
        logger.info(f"Classifying query: {query}")
        
        # Normalize query to lowercase for easier matching
        query_lower = query.lower()
        
        # Apply explicit fallback rules for EV scooters first
        if any(keyword in query_lower for keyword in ["ev scooter", "ev-scooter", "electric scooter", "e-scooter", "ec scotter", "scooter"]):
            logger.info("Explicit fallback rule applied: Query contains EV scooter keywords")
            category = "EV Scooters"
        # Category detection for other categories
        elif any(keyword in query_lower for keyword in ["mobile", "phone", "smartphone", "battery", "camera"]):
            category = "Mobiles"
        elif any(keyword in query_lower for keyword in ["laptop", "notebook", "computer", "processor", "ram", "ssd"]):
            category = "Laptops"
        elif any(keyword in query_lower for keyword in ["travel", "hotel", "flight", "booking", "trip"]):
            category = "Travel"
        else:
            category = "Other"  # Default category
        
        # Extract filters (simplified implementation)
        filters = self._extract_filters(query_lower, category)
        
        # Determine appropriate sources based on category
        sources = self.sources.get(category, self.sources["Other"])
        
        # Determine actions
        actions = ["search"]
        if "compare" in query_lower:
            actions.append("compare")
        actions.append("summarize")
        
        classification = {
            "category": category,
            "filters": filters,
            "sources": sources,
            "actions": actions
        }
        
        logger.info(f"Query classified as: {json.dumps(classification)}")
        return classification
    
    def _extract_filters(self, query: str, category: str) -> Dict[str, Dict[str, Any]]:
        """
        Extract filters from the query based on category.
        
        Args:
            query: Normalized user query
            category: Detected category
            
        Returns:
            Dictionary of filters
        """
        filters = {}
        
        # Price extraction (common across categories)
        price_keywords = ["under", "below", "less than", "cheaper than", "within"]
        price_units = {"k": 1000, "l": 100000, "lakh": 100000, "lakhs": 100000}
        
        for keyword in price_keywords:
            if keyword in query:
                parts = query.split(keyword)[1].strip().split()
                if parts and parts[0].replace('.', '', 1).isdigit():
                    price_value = float(parts[0])
                    # Check for units like k, L, etc.
                    if len(parts) > 1 and parts[1].lower() in price_units:
                        price_value *= price_units[parts[1].lower()]
                    filters["price"] = {"max": price_value}
                    break
        
        # Category-specific filters
        if category == "Mobiles":
            # Battery capacity
            if "mah" in query or "battery" in query:
                parts = query.split("battery")[0].strip().split()
                for i, part in enumerate(parts):
                    if part.isdigit() and int(part) >= 1000:
                        filters["battery"] = {"min": int(part)}
                        break
            
            # Camera megapixels
            if "mp" in query or "megapixel" in query or "camera" in query:
                parts = query.split("camera")[0].strip().split()
                for i, part in enumerate(parts):
                    if part.isdigit():
                        filters["camera"] = {"min": int(part)}
                        break
        
        elif category == "EV Scooters":
            # Range
            if "range" in query or "km" in query:
                parts = query.split("range")[0].strip().split()
                for i, part in enumerate(parts):
                    if part.isdigit():
                        filters["range"] = {"min": int(part)}
                        break
            
            # Charging time
            if "charging" in query or "charge" in query:
                parts = query.split("charging")[0].strip().split()
                for i, part in enumerate(parts):
                    if part.isdigit():
                        filters["charging_time"] = {"max": int(part)}
                        break
        
        elif category == "Laptops":
            # RAM
            if "ram" in query or "gb ram" in query:
                parts = query.split("ram")[0].strip().split()
                for i, part in enumerate(parts):
                    if part.isdigit():
                        filters["ram"] = {"min": int(part)}
                        break
            
            # Storage
            if "ssd" in query or "storage" in query or "hdd" in query:
                parts = query.split("storage")[0].strip().split()
                for i, part in enumerate(parts):
                    if part.isdigit():
                        filters["storage"] = {"min": int(part)}
                        break
        
        return filters
    
    # Define JSON schema for task plan validation
    TASK_PLAN_SCHEMA = {
        "type": "object",
        "properties": {
            "category": {"type": "string"},
            "filters": {"type": "object"},
            "sources": {"type": "array", "items": {"type": "string"}},
            "actions": {"type": "array", "items": {"type": "string"}},
            "reasoning": {"type": "object"}
        },
        "required": ["category", "actions"]
    }
    
    def validate_task_plan(self, plan: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate the task plan against the schema.
        
        Args:
            plan: The task plan to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            validate(instance=plan, schema=self.TASK_PLAN_SCHEMA)
            return True, None
        except ValidationError as e:
            logger.error(f"Task plan validation failed: {str(e)}")
            return False, str(e)
    
    def generate_task_plan(self, query: str) -> Dict[str, Any]:
        """
        Generate a structured task plan for the backend based on the user query.
        Uses a category-based cache to avoid misclassification issues.
        
        Args:
            query: User's natural language query
            
        Returns:
            JSON-compatible dictionary with the task plan
        """
        logger.info(f"Generating task plan for query: {query}")
        
        # First, classify the query
        classification = self.classify_query(query)
        category = classification["category"]
        filters = classification["filters"]
        
        # Generate cache key based on category and filters
        cache_key = self.make_cache_key(category, filters)
        
        # Check if we have a cached task plan for this category+filters combination
        if cache_key in self.cache:
            logger.info(f"Using cached task plan for category '{category}' with filters {filters}")
            return self.cache[cache_key]
        
        # Create the task plan
        task_plan = {
            "category": category,
            "filters": filters,
            "sources": classification["sources"],
            "actions": classification["actions"],
            "reasoning": {
                "detected_category": category,
                "applied_filters": filters,
                "selected_sources": classification["sources"],
                "query_understanding": f"Understood query as a request for {category} with specific constraints."
            }
        }
        
        # Handle edge cases
        if category == "Other":
            task_plan["reasoning"]["query_understanding"] = "Could not confidently classify the query into a specific category."
            task_plan["status"] = "uncertain"
            task_plan["suggestion"] = "Please provide more specific details about what you're looking for."
        
        # Validate the task plan
        is_valid, error = self.validate_task_plan(task_plan)
        if not is_valid:
            logger.warning(f"Generated invalid task plan: {error}")
            # Ensure we have at least the required fields
            if "category" not in task_plan:
                task_plan["category"] = "Other"
            if "actions" not in task_plan:
                task_plan["actions"] = ["search"]
        
        # Cache the task plan using the composite key
        self.cache[cache_key] = task_plan
        
        logger.info(f"Generated task plan: {json.dumps(task_plan)}")
        logger.info(f"Cached with key: {cache_key}")
        return task_plan
    
    def simulate_results(self, task_plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Simulate search results based on the task plan.
        In a real implementation, this would call actual scrapers.
        
        Args:
            task_plan: The task plan to use for simulation
            
        Returns:
            List of simulated product results
        """
        category = task_plan["category"]
        logger.info(f"Simulating results for category: {category}")
        
        # Simulate different results based on category
        if category == "Mobiles":
            return [
                {
                    "id": "m1",
                    "name": "Samsung Galaxy A54 5G",
                    "price": 26999,
                    "originalPrice": 32999,
                    "source": "Amazon",
                    "specs": ["6.4\" Super AMOLED", "50MP Triple Camera", "5000mAh Battery"],
                    "score": 9.2,
                    "rating": 4.3,
                    "reviews": 12543,
                    "url": "https://www.amazon.in/samsung-galaxy-a54",
                    "isTopPick": True
                },
                {
                    "id": "m2",
                    "name": "OnePlus Nord CE 3 Lite",
                    "price": 19999,
                    "originalPrice": 23999,
                    "source": "Flipkart",
                    "specs": ["6.72\" LCD Display", "108MP Main Camera", "5000mAh Battery"],
                    "score": 8.7,
                    "rating": 4.1,
                    "reviews": 8934,
                    "url": "https://www.flipkart.com/oneplus-nord-ce-3-lite",
                    "isTopPick": False
                }
            ]
        elif category == "EV Scooters":
            return [
                {
                    "id": "ev1",
                    "name": "Ather 450X Gen 3",
                    "price": 158000,
                    "originalPrice": 165000,
                    "source": "Ather",
                    "specs": ["146 km Range", "80 kmph Top Speed", "3.3 kWh Battery"],
                    "score": 9.5,
                    "rating": 4.7,
                    "reviews": 3245,
                    "url": "https://www.atherenergy.com/450x",
                    "isTopPick": True
                },
                {
                    "id": "ev2",
                    "name": "Ola S1 Pro",
                    "price": 129999,
                    "originalPrice": 139999,
                    "source": "OlaElectric",
                    "specs": ["181 km Range", "115 kmph Top Speed", "4 kWh Battery"],
                    "score": 9.1,
                    "rating": 4.4,
                    "reviews": 5678,
                    "url": "https://olaelectric.com/s1-pro",
                    "isTopPick": False
                }
            ]
        elif category == "Laptops":
            return [
                {
                    "id": "l1",
                    "name": "HP Pavilion 15",
                    "price": 65999,
                    "originalPrice": 72999,
                    "source": "HP",
                    "specs": ["15.6\" FHD Display", "Intel i5-12450H", "16GB RAM", "512GB SSD"],
                    "score": 8.9,
                    "rating": 4.2,
                    "reviews": 3456,
                    "url": "https://www.hp.com/pavilion-15",
                    "isTopPick": True
                },
                {
                    "id": "l2",
                    "name": "Lenovo IdeaPad Slim 3",
                    "price": 49999,
                    "originalPrice": 54999,
                    "source": "Lenovo",
                    "specs": ["14\" FHD Display", "AMD Ryzen 5 5500U", "8GB RAM", "512GB SSD"],
                    "score": 8.5,
                    "rating": 4.0,
                    "reviews": 2345,
                    "url": "https://www.lenovo.com/ideapad-slim-3",
                    "isTopPick": False
                }
            ]
        else:
            # Default results for other categories
            return [
                {
                    "id": "g1",
                    "name": "Generic Product 1",
                    "price": 9999,
                    "source": "Amazon",
                    "specs": ["Feature 1", "Feature 2", "Feature 3"],
                    "score": 7.5,
                    "rating": 3.8,
                    "reviews": 1234,
                    "url": "https://www.amazon.in/generic-product-1",
                    "isTopPick": True
                }
            ]
            
    def refine_query(self, query: str, results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Refine the query if initial results are empty or insufficient.
        
        Args:
            query: Original user query
            results: Initial results from backend
            
        Returns:
            Refined task plan
        """
        logger.info(f"Refining query due to insufficient results: {query}")
        
        # Get the original task plan
        original_plan = self.generate_task_plan(query)
        category = original_plan["category"]
        
        # Check if results are empty
        if not results.get("products") or len(results.get("products", [])) == 0:
            # Broaden filters
            refined_plan = original_plan.copy()
            
            # Adjust filters to be more lenient
            for filter_key, filter_value in refined_plan["filters"].items():
                if "min" in filter_value:
                    refined_plan["filters"][filter_key]["min"] = filter_value["min"] * 0.8  # Reduce minimum by 20%
                if "max" in filter_value:
                    refined_plan["filters"][filter_key]["max"] = filter_value["max"] * 1.2  # Increase maximum by 20%
            
            # Add more sources
            refined_plan["sources"] = list(set(refined_plan["sources"] + self.sources.get("Other", [])))
            
            # Update reasoning
            refined_plan["reasoning"]["adjustments"] = "Broadened filters and added more sources due to insufficient results."
            
            # Update cache with the refined plan
            cache_key = self.make_cache_key(category, refined_plan["filters"])
            self.cache[cache_key] = refined_plan
            
            logger.info(f"Refined task plan: {json.dumps(refined_plan)}")
            return refined_plan
        
        return original_plan
    
    def generate_summary(self, results: Dict[str, Any], task_plan: Dict[str, Any]) -> str:
        """
        Generate a TL;DR summary of the results based on the category.
        
        Args:
            results: Results from backend
            task_plan: Task plan used to generate results
            
        Returns:
            Summary string
        """
        category = task_plan["category"]
        products = results.get("products", [])
        
        if not products:
            return "No results found matching your criteria."
        
        # Sort products by score or price
        if "score" in products[0]:
            products = sorted(products, key=lambda x: x.get("score", 0), reverse=True)
        else:
            products = sorted(products, key=lambda x: x.get("price", float('inf')))
        
        best_product = products[0]
        
        if category == "Mobiles":
            return f"Best Mobile: {best_product.get('name', 'Unknown')} at ₹{best_product.get('price', 'N/A')} with {best_product.get('battery', 'N/A')} mAh battery and {best_product.get('camera', 'N/A')} MP camera."
        
        elif category == "EV Scooters":
            return f"Best EV Scooter: {best_product.get('name', 'Unknown')} at ₹{best_product.get('price', 'N/A')} with {best_product.get('range', 'N/A')} km range and {best_product.get('charging_time', 'N/A')} hours charging time."
        
        elif category == "Laptops":
            return f"Best Laptop: {best_product.get('name', 'Unknown')} at ₹{best_product.get('price', 'N/A')} with {best_product.get('processor', 'N/A')} processor, {best_product.get('ram', 'N/A')} GB RAM, and {best_product.get('storage', 'N/A')} GB storage."
        
        else:
            return f"Best match: {best_product.get('name', 'Unknown')} at ₹{best_product.get('price', 'N/A')}."