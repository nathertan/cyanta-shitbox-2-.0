import { Message, TextChannel } from "discord.js";
import { PrefixCommand } from "../../types/Command";

const command: PrefixCommand = {
    name: 'test',
    async execute(message: Message) {
        await message.reply('ong kontol');
    },
};

export default command;
