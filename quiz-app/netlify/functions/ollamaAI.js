import fetch from "node-fetch";

export async function handler(event) {
  console.log("ollamaAI function called");

  try {
    // Parse request body
    const body = JSON.parse(event.body || "{}");
    console.log("Request body:", body);

    const { prompt, model = "llama3.2:latest" } = body;

    if (!prompt) {
      console.error("No prompt provided");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

    console.log("Calling Ollama at localhost:11434 with model:", model);

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
      }),
    });

    console.log("📡 Ollama response status:", res.status);

    const data = await res.json();
    console.log(
      "Ollama response data:",
      JSON.stringify(data).substring(0, 200)
    );

    if (!res.ok) {
      console.error("Ollama error:", data.error);
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: data.error || "Ollama API error" }),
      };
    }

    if (!data.response) {
      console.error("No response field in Ollama data");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid response from Ollama" }),
      };
    }

    console.log("Success!");
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: data.response,
        model: data.model,
        done: data.done,
      }),
    };
  } catch (error) {
    console.error("Exception in ollamaAI:", error.message);
    console.error("Stack:", error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
