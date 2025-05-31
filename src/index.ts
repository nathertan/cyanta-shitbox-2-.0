import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, Interaction, Message } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const PREFIX = '!';


client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Ong kontol');
    }
});

client.on('messageCreate', (message: Message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    if (command === 'ping') {
        message.reply('test');
    }
})


client.login(process.env.BOT_TOKEN);