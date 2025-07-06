import { Message, TextChannel } from "discord.js";
import { PrefixCommand } from "../../types/Command";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import gemini from "../../utils/gemini";

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

            const input = args.join(" ");
            const geminiResponse = await gemini.execute(input);

            for (const response of geminiResponse) {
                await (message.channel as TextChannel).send(response);
                // console.log("AAAAAAAAAAAAAAAAAAAAAAA", response);
            }
        }
    },
};

export default command;
