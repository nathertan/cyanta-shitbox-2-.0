import { Message, TextChannel } from "discord.js";
import { PrefixCommand } from "../../types/Command";
import * as dotenv from 'dotenv';
import gemini from "../../utils/gemini";

dotenv.config();
const command: PrefixCommand = {
    name: 'ai',
    async execute(message: Message, args: string[]) {
        if (message.channel?.isTextBased()) {

            const input = args.join(" ");
            const geminiResponse = await gemini.execute(input);

            for (const response of geminiResponse) {
                await (message.channel as TextChannel).send(response);
            }
        }
    },
};

export default command;
