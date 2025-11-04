import fetch from "node-fetch";

const rateLimits = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = rateLimits.get(ip);

  if (!userLimit) {
    rateLimits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1 };
  }

  if (now > userLimit.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1 };
  }

  if (userLimit.count >= MAX_REQUESTS_PER_MINUTE) {
    const waitTime = Math.ceil((userLimit.resetTime - now) / 1000);
    return { allowed: false, waitTime };
  }

  userLimit.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_MINUTE - userLimit.count,
  };
}

export async function handler(event) {
  console.log("ollamaAI function called");

  try {
    const clientIP =
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      "unknown";
    const rateCheck = checkRateLimit(clientIP);

    if (!rateCheck.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return {
        statusCode: 429,
        headers: {
          "Retry-After": rateCheck.waitTime.toString(),
          "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
          "X-RateLimit-Remaining": "0",
        },
        body: JSON.stringify({
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${rateCheck.waitTime} seconds.`,
          retryAfter: rateCheck.waitTime,
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    console.log("Request body:", body);
    console.log(
      `Rate limit - Remaining: ${rateCheck.remaining}/${MAX_REQUESTS_PER_MINUTE}`,
    );

    const { prompt, model = "llama3.2:latest" } = body;

    if (!prompt) {
      console.error("No prompt provided");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

    const MAX_PROMPT_LENGTH = 2000;
    if (prompt.length > MAX_PROMPT_LENGTH) {
      console.error(`Prompt too long: ${prompt.length} chars`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Prompt too long",
          message: `Maximum prompt length is ${MAX_PROMPT_LENGTH} characters`,
        }),
      };
    }

    const ALLOWED_MODELS = ["llama3.2:latest", "llama3.2"];
    if (!ALLOWED_MODELS.includes(model)) {
      console.error(`Unauthorized model requested: ${model}`);
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Model not allowed",
          allowedModels: ALLOWED_MODELS,
        }),
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

    console.log("Ollama response status:", res.status);

    const data = await res.json();
    console.log(
      "Ollama response data:",
      JSON.stringify(data).substring(0, 200),
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
      headers: {
        "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
        "X-RateLimit-Remaining": rateCheck.remaining.toString(),
      },
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
