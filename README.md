# BROWSEEASE

---
## 🆔 Problem Statement ID: HACXPB002

### Problem Statement: Web Navigator AI Agent

**Summary:**
Build an AI Agent that can take natural language instructions and autonomously drive the web on a local computer. The system should combine a locally running LLM (for understanding and planning) with a browser automation setup such as Chrome Headless or a browser inside a local VM. Users should be able to give simple commands (e.g., "search for laptops under 50k and list top 5") and the agent should execute them by controlling the browser, extracting results, and returning structured outputs.

**Suggested Tech Stacks:**

- Orchestration: Python/Node.js
- Instruction Parsing: LangChain/Ollama or other local LLMs
- Browser Automation: Playwright/Selenium/Puppeteer

---


## 🤔 Problem Understanding
- Users need more than basic web scraping; they want an agent that understands natural language instructions.
- Existing tools often break when website layouts change, causing unreliable automation.
- Lack of transparency in current solutions makes it hard for users to trust results.
- Real-time feedback and explainable reasoning are missing in most web automation tools.
- There is a demand for resilient, local-first solutions that empower users with control and understanding.

---

## 🦄 Uniqueness of the Solution
- Uses local LLM-powered planning for privacy and explainability.
- Employs self-healing browser automation that adapts to changing website layouts.
- Provides live progress updates and transparent logs for every action taken.
- Delivers structured, side-by-side comparisons and actionable insights, not just raw data.
- All logic runs locally, ensuring user data privacy and full transparency.
- Caching and retry mechanisms make repeated queries instant and robust against errors.

---
---

## 🚀 Detailed Proposal & Prototype Plan

BROWSEEASE is a Web Navigator Agent that takes natural language instructions and autonomously browses the web on your local system. It understands queries like “search for laptops under 50k and compare top 5,” drives a browser to collect information from multiple sites, and returns structured, actionable results (not just raw webpages).

### Prototype Plan

**Frontend:**

- Clean, intuitive interface with a query box for user instructions
- Live progress updates as the agent browses and extracts data
- Structured result tables for easy comparison
- Transparent, explainable logs for every step

**Backend:**

- Receives and interprets user queries
- Plans tasks and controls a headless browser for web automation
- Extracts structured results from multiple sites in parallel
- Integrates query understanding and task planning logic to classify user intent (e.g., Mobiles, EV Scooters, Laptops), apply filters, and select the best sources
- Implements caching and retry logic for instant responses to repeated queries and robust handling of new queries
- Connects with the frontend via real-time updates so users see search progress and results as they load

---

## ✨ Features

- **Self-Healing Web Automation:**
  - Automatically adapts to website layout changes using multiple fallback extraction methods and retries if one fails.
- **Fully Local & Explainable Reasoning:**
  - All planning and reasoning run locally, with transparent logs for every decision and browsing step.
- **Multi-Tab Smart Comparison & Summarization:**
  - Opens and manages multiple sites in parallel, extracts structured data, compares results, and produces side-by-side insights.
- **Structured Results:**
  - Delivers clean comparison tables and short recommendation summaries instead of raw links.
- **Real-Time Progress:**
  - Shows live updates as the agent browses and extracts data.
- **Caching & Retry:**
  - Fast responses for repeated queries and robust error handling.

---

## 🛠️ Tech Stack

**Frontend:**

- React (TypeScript)
- Vite
- Tailwind CSS
- ShadcnUI

**Backend:**

- Python
- FastAPI
- WebSockets
- Uvicorn

**AI & Data Processing:**

- LLM Integration (Ollama2 model, in progress)
- Custom scraping engine
- Vector database for semantic search


**DevOps:**

- Git (version control)
- Netlify (frontend deployment)

---

# 🌐 Live Project

Check out the live project here: [https://browseease.netlify.app/](https://browseease.netlify.app/)

---

## 📂 Problem Statement PPT

This is the PPT of my problem statement: [View PPT](https://drive.google.com/file/d/1VAW4MmE0PkdeitL7S2BiRg38Ljq8tHDt/view?usp=drivesdk)

---

## 👥 Team & Contributions

| Name        | Role                          | Key Contributions                                                                  |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| R. Pavani   | Project Lead & Frontend Lead  | Project architecture, UI/UX, React components, state management, team coordination |
| M. Vishnu   | Backend Lead                  | Backend API, AI model integration, performance optimization                        |
| K. Kartheek  | Full Stack Developer          | WebSocket implementation, API integration, search algorithm, testing               |
| SK. Haseena | AI & Data Specialist          | Web scraping, data pipelines, result ranking, content summarization                |
| T. Jyothi   | QA & Documentation Specialist | QA, user documentation, UX research, accessibility                                 |

---

## 📢 Project Status

> **Note:** The full prototype is not yet complete. We are currently solving some errors while connecting the (Ollama2) LLM model. And there is no much time to take our video clearly.so we were not presented our whole individual efforts in the video.
As a team we can complete our work in next round...
