import { SlashCommandBuilder, ChatInputCommandInteraction, Message } from 'discord.js';

export interface SlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface PrefixCommand {
    name: string;
    execute: (message: Message, args: string[]) => Promise<void>;
}