def gen_response(message):
    import ollama
    MODEL_NAME = "llama3"  # Ensure this model is pulled and available in Ollama

    #message = input()

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

    user_prompt = message

    messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
    ]

    response = ollama.chat(model=MODEL_NAME, messages=messages)
    content = response['message']['content']
    return content

print(gen_response("hello there i am here to spend some time with you"))