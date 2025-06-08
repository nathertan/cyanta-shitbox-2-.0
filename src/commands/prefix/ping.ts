import { Message } from "discord.js";
import { PrefixCommand } from "../../types/Command";

const command: PrefixCommand = {
    name: 'ping',
    async execute(message: Message, args: string[]) {
        if (message.channel?.isTextBased()) {
            // @ts-expect-error
            const sent = await message.channel.send('Calculating Ping...');
            const latency = sent.createdTimestamp - message.createdTimestamp;
            const apiLatency = Math.round(message.client.ws.ping);

            await sent.edit(
                `Pong!\n> Latency: ${latency}ms\n> Bot to Discord: ${apiLatency}ms`
            );
        }
    },
};

export default command;
