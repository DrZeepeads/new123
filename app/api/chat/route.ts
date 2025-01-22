import { NextRequest, NextResponse } from "next/server";
import { AIModel } from "@/types/settings";

export const runtime = "edge";

const MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";

async function generateMistralResponse(messages: { role: string; content: string }[], model: AIModel) {
  const response = await fetch(MISTRAL_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: model === "mistral" ? "mistral-tiny" : model,
      messages: messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  if (!process.env.MISTRAL_API_KEY) {
    return NextResponse.json(
      { error: "Mistral API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { messages, model = "mistral-medium" } = await req.json();
    const response = await generateMistralResponse(messages, model as AIModel);

    return NextResponse.json({
      role: "assistant",
      content: response,
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during chat" },
      { status: 500 }
    );
  }
}
