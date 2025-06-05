import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../../types/Command";
import axios from "axios";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription('Random quotes fetched form zenquotes'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const response = await axios('https://zenquotes.io/api/random');
            const [data] = await response.data;
            await interaction.reply(`"${data.q}"\n- *${data.a}`);
        } catch (error) {
            console.error("Error fetching quote: ", error);
            await interaction.reply("Error fetching quote, try again later");
        }
    },
};

export default command;