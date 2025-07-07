import { Client, GatewayIntentBits, Interaction, Message, ThreadChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import path from 'path';
import { loadFiles } from './utils/loadCommands';
import { SlashCommand, PrefixCommand } from './types/Command';
import { geminiThread } from './utils/gemini';
import { getHistory } from './commands/slash/thread-ai';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent],
});

const PREFIX = 'c!';

const slashCommands = loadFiles<SlashCommand>(path.join(__dirname, 'commands', 'slash'));
const PrefixCommand = loadFiles<PrefixCommand>(path.join(__dirname, 'commands', 'prefix'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    setTimeout(() => {
        console.log(`Bot Ready! Websocket ping to servers is ${client.ws.ping}ms`);
    }, 5000);
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = slashCommands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'Error executing command', ephemeral: true });
    }
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const name = args.shift()?.toLowerCase();
    const command = PrefixCommand.get(name!);
    if (!command) return;
    try {
        await command.execute(message, args);
    } catch (err) {
        console.error(err);
        await message.reply('Error executing command.');
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.channel.isThread() && message.channel.name.includes('bot-chat-with')) {
        const currentThread = message.channel as ThreadChannel;
        const chatHistory = await getHistory(message.channel);
        const lastMessage = message.content;

        if (chatHistory.length === 0) {
            chatHistory.unshift({
                role: 'user',
                parts: [{ text: `You are Cyanta, a helpful Discord bot with a witty personality, but still respectful, like a brother. Your job is to answer questions and chat in a friendly, concise way. Also tone down the parentheses and dont be cringe ` }]
            });
        }

        chatHistory.push({
            role: "user",
            parts: [{ text: lastMessage }],
        });

        // --- DEBUGGING LOG ---
        console.log("--- Conversation Context being sent to Gemini ---");
        console.log(JSON.stringify(chatHistory, null, 2)); // Pretty-print the array
        console.log("-------------------------------------------------");
        // --- END DEBUGGING LOG ---


        await currentThread.sendTyping();

        const geminiResponse = await geminiThread(chatHistory);
        for (const response of geminiResponse) {
            await message.channel.send(response);
        }
    }
})

client.login(process.env.BOT_TOKEN);
