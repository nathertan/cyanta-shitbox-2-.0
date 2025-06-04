import { REST, Routes } from "discord.js";
import * as dotenv from 'dotenv';
import path from 'path';
import { loadFiles } from "./utils/loadCommands";
import { SlashCommand } from "./types/Command";

dotenv.config();

const commandsPath = path.join(__dirname, 'commands', 'slash');
const slashCommands = loadFiles<SlashCommand>(commandsPath);

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

(async () => {
    try {
        console.log('Registering slash comands...');
        const body = [...slashCommands.values()].map(cmd => cmd.data.toJSON());

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body }
        );

        console.log('Slash commands registered.');
    } catch (error) {
        console.error('ERror registering commands: ', error);
    }
})();