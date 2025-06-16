import { Message } from "discord.js";
import { PrefixCommand } from "../../types/Command";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import { defaultPrompt } from "../../utils/prompts";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function chunkSplit(text: string, maxLength = 2000): string[] {
    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > maxLength) {
        let splitIndex = remaining.lastIndexOf("\n\n", maxLength);
        if (splitIndex === -1) splitIndex = remaining.lastIndexOf(". ", maxLength);
        if (splitIndex === -1) splitIndex = maxLength;

        const chunk = remaining.slice(0, splitIndex + 1).trim();
        chunks.push(chunk);
        remaining = remaining.slice(splitIndex + 1).trim();
    }

    if (remaining.length > 0) chunks.push(remaining);
    return chunks;
}

const command: PrefixCommand = {
    name: 'ai',
    async execute(message: Message, args: string[]) {
        if (message.channel?.isTextBased()) {

            const Message = args.join(" ");
            const prompt = defaultPrompt(Message);
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });

            // const fullText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

            const chunks = chunkSplit(response.text || "No response.");

            for (const chunk of chunks) {
                //@ts-expect-error
                await message.channel.send(chunk);
            }

            // console.log(response.text);
        }
    },
};

export default command;
