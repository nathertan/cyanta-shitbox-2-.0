import { GoogleGenAI, Content } from "@google/genai";
import * as dotenv from 'dotenv';
import { defaultPrompt } from "./prompts";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
type GeminiChatHistory = Array<Content>;

function chunkSplit(response: string, maxLength = 2000): string[] {
    const outputChunks: string[] = [];
    let tempString = response;

    while (tempString.length > maxLength) {
        let splitIndex = maxLength;
        const enterCheck = tempString.lastIndexOf("\n\n", maxLength);
        if (enterCheck != -1) {
            splitIndex = enterCheck;
        } else {
            const fullStopCheck = tempString.lastIndexOf(". ", maxLength);
            if (fullStopCheck != -1) {
                splitIndex = fullStopCheck;
            } else {
                const spaceCheck = tempString.lastIndexOf(" ", maxLength);
                if (spaceCheck != -1) {
                    splitIndex = spaceCheck;
                }
            }
        }
        const splittedChunks = tempString.slice(0, splitIndex + 1).trim();
        outputChunks.push(splittedChunks);
        if (enterCheck != -1) {
            tempString = "_ _\n" + tempString.slice(splitIndex + 1).trim();
        } else {
            tempString = tempString.slice(splitIndex + 1).trim();
        }
    }
    if (tempString.length > 0) {
        outputChunks.push(tempString);
    }

    return outputChunks;
}

export async function geminiPrefix(args: string) {
    const prompt = defaultPrompt(args);
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    const splittedText = chunkSplit(response.text || "No response.");
    return splittedText;
}

export async function geminiThread(chatHistory: GeminiChatHistory): Promise<string[]> {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: chatHistory,
    });
    const splittedText = chunkSplit(response.text || "No Response.");
    return splittedText;
}
