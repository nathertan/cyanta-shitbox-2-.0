import { SlashCommandBuilder, ChatInputCommandInteraction, ThreadAutoArchiveDuration, TextChannel, ThreadChannel } from "discord.js";
import { SlashCommand } from "../../types/Command";
import { Content } from "@google/genai";

export async function getHistory(thread: ThreadChannel): Promise<Array<Content>> {
    const messages = await thread.messages.fetch({ limit: 25 });

    const sortedMessages = Array.from(messages.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    const chatHistory: Array<Content> = [];

    for (const message of sortedMessages) {
        if (message.author.bot && message.content.startsWith("Hello ")) {
            continue;
        }

        let assignedRole: string;
        if (message.author.bot) {
            assignedRole = "model";
        } else {
            assignedRole = "user";
        }

        chatHistory.push({
            role: assignedRole,
            parts: [{ text: message.content }],
        });
    }

    return chatHistory;
}

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Start a conversation with Bot'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.channel;

        if (!channel || channel.type !== 0) {
            await interaction.reply({
                content: "This command is only able to be used on a text channel.",
                ephemeral: true,
            });
            return;
        }

        const textChannel = channel as TextChannel;
        const currentTime = new Date();
        const timeStamp = currentTime.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(/[/, :]/g, '-');

        const thread = await textChannel.threads.create({
            name: `bot-chat-with-${interaction.user.username}-${timeStamp}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
            reason: "New chat thread with bot",
        });

        await interaction.reply({
            content: `Thread have been made: <#${thread.id}>`,
            ephemeral: true,
        });

        await thread.send(
            `Hello <@${interaction.user.id}>! This is a thread for private chat.`
        );
    },
};

export default command;