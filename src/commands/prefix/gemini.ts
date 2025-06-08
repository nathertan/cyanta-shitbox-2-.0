import { Message } from "discord.js";
import { PrefixCommand } from "../../types/Command";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const command: PrefixCommand = {
    name: 'ai',
    async execute(message: Message, args: string[]) {
        if (message.channel?.isTextBased()) {

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: "what are you? what is your model name?"
            })
            // @ts-expect-error
            const sent = await message.channel.send(response.text);
            console.log(response.text);
        }
    },
};

export default command;
