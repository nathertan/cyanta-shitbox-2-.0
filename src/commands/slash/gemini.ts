import { SlashCommandBuilder, ChatInputCommandInteraction, ThreadAutoArchiveDuration, TextChannel } from "discord.js";
import { SlashCommand } from "../../types/Command";

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
        }

        const thread = await (channel as TextChannel).threads.create({
            name: `bot-chat-with-${interaction.user.username}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
            reason: "-",
        });

        await interaction.reply({
            content: `Thread have been made: <#${thread.id}>`,
            ephemeral: true,
        });

        await thread.send(
            `Hello <@#{interaction.user.id}>! This is a thread for private chat.`
        );
    },
};

export default command;