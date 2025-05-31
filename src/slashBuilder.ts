import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Buat ngatain ong')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN as string);

(async () => {
    try {
        console.log('Register slash commands...');
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID as string
            ),
            { body: commands }
        );
        console.log('Slash Command registered.');
    } catch (error) {
        console.error('Failed to register commands: ', error);
    }
})();