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
  console.log("LLM function called");

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

    const AI_PROVIDER = process.env.AI_PROVIDER || "ollama";
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

    let responseText;

    if (AI_PROVIDER === "groq" && GROQ_API_KEY) {
      console.log("Using Groq API with model: llama-3.3-70b-versatile");

      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 1024,
          }),
        },
      );

      if (!groqRes.ok) {
        const errorData = await groqRes.json().catch(() => ({}));
        console.error("Groq error:", errorData);
        throw new Error(errorData.error?.message || "Groq API error");
      }

      const groqData = await groqRes.json();
      responseText = groqData.choices?.[0]?.message?.content;

      if (!responseText) {
        throw new Error("No response from Groq API");
      }

      console.log("Groq Success!");
      return {
        statusCode: 200,
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
          "X-RateLimit-Remaining": rateCheck.remaining.toString(),
        },
        body: JSON.stringify({
          response: responseText,
          model: "llama-3.3-70b-versatile",
          done: true,
          provider: "groq",
        }),
      };
    } else if (AI_PROVIDER === "huggingface" && HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API");

      const hfRes = await fetch(
        "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 512,
              temperature: 0.5,
            },
          }),
        },
      );

      if (!hfRes.ok) {
        const errorData = await hfRes.json().catch(() => ({}));
        console.error("Hugging Face error:", errorData);
        throw new Error(errorData.error || "Hugging Face API error");
      }

      const hfData = await hfRes.json();
      responseText = Array.isArray(hfData)
        ? hfData[0]?.generated_text
        : hfData.generated_text;

      if (!responseText) {
        throw new Error("No response from Hugging Face API");
      }

      console.log("Hugging Face Success!");
      return {
        statusCode: 200,
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
          "X-RateLimit-Remaining": rateCheck.remaining.toString(),
        },
        body: JSON.stringify({
          response: responseText,
          model: "meta-llama/Llama-3.2-3B-Instruct",
          done: true,
          provider: "huggingface",
        }),
      };
    } else {
      const OLLAMA_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
      const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

      console.log("Using Ollama at", OLLAMA_URL, "with model:", model);

      const headers = {
        "Content-Type": "application/json",
      };

      if (OLLAMA_API_KEY) {
        headers["Authorization"] = `Bearer ${OLLAMA_API_KEY}`;
      }

      const res = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: headers,
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

      console.log("Ollama Success!");
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
          provider: "ollama",
        }),
      };
    }
  } catch (error) {
    console.error("Exception in LLM:", error.message);
    console.error("Stack:", error.stack);

    if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("ECONNREFUSED")
    ) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          error: "Service Unavailable",
          message:
            "AI evaluation service is not available. Ollama is not running or not accessible.",
          code: "OLLAMA_UNAVAILABLE",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        code: "INTERNAL_ERROR",
      }),
    };
  }
}
