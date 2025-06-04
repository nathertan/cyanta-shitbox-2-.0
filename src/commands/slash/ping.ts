import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../../types/Command";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Buat ngatain ong'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Ong kontol');
    },
};

export default command;