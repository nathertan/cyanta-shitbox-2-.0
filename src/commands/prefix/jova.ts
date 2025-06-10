import { Message } from "discord.js";
import { PrefixCommand } from "../../types/Command";

const command: PrefixCommand = {
    name: 'jova',
    async execute(message: Message, args: string[]) {
        const userId = "666604533329297408";
        if (!message.guild) {
            await message.reply("This command only works on servers.");
            return;
        }

        try {
            const member = await message.guild.members.fetch(userId);

            if (!member) {
                await message.reply("The user is not in this server");
                return;
            }
            await message.reply(`jova kontol <@${userId}>`);
        } catch (error) {
            console.error("Error fetching member: ", error);
            await message.reply("Couldn't find that user in the server");
        }

    },
};
export default command;
