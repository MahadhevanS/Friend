from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import re

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"
HEADERS = {"Content-Type": "application/json"}
MODEL_NAME = "llama3"

def fix_json_format(text: str) -> str:
    """
    Attempt to fix minor JSON formatting issues like missing closing brace.
    """
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        json_like = match.group()
        open_braces = json_like.count('{')
        close_braces = json_like.count('}')
        if open_braces > close_braces:
            json_like += '}' * (open_braces - close_braces)
        return json_like
    return text

@app.post("/api/message")
async def process_message(req: Request):
    try:
        data = await req.json()
        user_message = data.get("message", "")

        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")

        system_prompt = """
        You are a friendly assistant. For each user message:
        1. Detect the user's mood as any of the following happy, sad, stressed, lonely, angry, excited.
        2. Give a kind, helpful reply.

        Your reply should be strictly in this format, don't forget the curly brackets:
        {
          "mood": "<mood>",
          "reply": "<friendly reply>"
        }
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        payload = {
            "model": MODEL_NAME,
            "messages": messages,
            "stream": False
        }

        response = requests.post(OLLAMA_URL, json=payload, headers=HEADERS)
        response.raise_for_status()

        result = response.json()
        raw_output = result.get("message", {}).get("content", "").strip()
        print("Raw Output from LLM:\n", raw_output)
        if raw_output[-1]!='}':
            raw_output+='}'
        fixed_output = fix_json_format(raw_output)
        print(fixed_output)
        parsed = json.loads(fixed_output)


        return {
            "mood": parsed.get("mood", ""),
            "reply": parsed.get("reply", "")
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON parsing error: {str(e)}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request to Ollama failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
