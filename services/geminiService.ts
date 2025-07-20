
import { GoogleGenAI, Chat } from "@google/genai";
import { ModelConfig, ChatMessage, MessageRole } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function createChat(config: ModelConfig, history: ChatMessage[]): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: config.systemInstruction,
      temperature: config.temperature,
      topP: config.topP,
      topK: config.topK,
    },
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    })),
  });
  return chat;
}

export async function sendMessageStream(
  message: string,
  history: ChatMessage[],
  config: ModelConfig,
  onStreamUpdate: (chunk: string) => void
): Promise<void> {
  const chat = createChat(config, history);

  try {
    const stream = await chat.sendMessageStream({ message });
    for await (const chunk of stream) {
        const chunkText = chunk.text;
        if(chunkText) {
          onStreamUpdate(chunkText);
        }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = `Sorry, something went wrong: ${error.message}`;
    }
    onStreamUpdate(errorMessage);
  }
}

export async function generateChatTitle(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, snappy title (3-5 words) for a chat that starts with this prompt: "${prompt}". Do not use quotes or any other formatting in the response.`,
            config: {
                thinkingConfig: { thinkingBudget: 0 },
                temperature: 0.3,
            }
        });
        return response.text.replace(/"/g, '').trim();
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat";
    }
}
