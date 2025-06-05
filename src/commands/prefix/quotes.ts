import { Message } from "discord.js";
import { PrefixCommand } from "../../types/Command";
import axios from "axios";

const command: PrefixCommand = {
    name: 'quotes',
    async execute(message: Message) {
        try {
            const response = await axios('https://zenquotes.io/api/random');
            const [data] = await response.data;

            await message.reply(`"${data.q}"\n- *${data.a}*`);
        } catch (error) {
            console.error("Error fetching quote:", error);
            await message.reply("Error fetching quote, try again later");
        }
    },
};

export default command;
