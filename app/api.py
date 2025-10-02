"""
API routes for BROWSEEASE
"""

from fastapi import APIRouter, Request
from app.llm.provider import LLMProvider

router = APIRouter()
llm_provider = LLMProvider()

@router.post("/prompt")
async def handle_prompt(request: Request):
    data = await request.json()
    query = data.get("query", "")
    prompt_type = data.get("prompt_type", "default")
    context = data.get("context", None)

    # Handle 4 prompt types
    if prompt_type == "search":
        plan = llm_provider.generate_task_plan(query)
        results = llm_provider.ollama_integration.simulate_results(plan)
        return {"plan": plan, "results": results}
    elif prompt_type == "compare":
        plan = llm_provider.generate_task_plan(query)
        results = llm_provider.ollama_integration.simulate_results(plan)
        # Add comparison logic if needed
        return {"plan": plan, "results": results, "comparison": "Comparison done."}
    elif prompt_type == "summarize":
        plan = llm_provider.generate_task_plan(query)
        results = llm_provider.ollama_integration.simulate_results(plan)
        summary = llm_provider.ollama_integration.generate_summary({"products": results}, plan)
        return {"plan": plan, "results": results, "summary": summary}
    elif prompt_type == "refine":
        plan = llm_provider.generate_task_plan(query)
        results = llm_provider.ollama_integration.simulate_results(plan)
        refined_plan = llm_provider.ollama_integration.refine_query(query, {"products": results})
        return {"plan": refined_plan, "results": results}
    else:
        return {"error": "Unknown prompt type"}
