import { Message } from "eris";
import { Event } from "../structures/Event.js";

export default class MessageDelete extends Event {
    name = 'messageDelete';

    async run(message: Message) {
        if (message.author.bot || message.channel.type === 1) return; // don't log bots.
        const guild = this.client.guilds.get(message.guildID!)
        if (!guild) {
            throw new Error(`Not in guild '${message.guildID}'`);
        }
        const { logging } = await guild.getModules();

        if (
            logging.enabled && // Make sure that logging is enabled.
            logging.options.actions.messages.delete && // Make sure logging deleted messages is enabled.
            logging.options.logChannel !== null && // Make sure a log channel is set.
            guild.channels.has(logging.options.logChannel) // Make sure the log channel exists.
        ) {
            this.client.createMessage(
                logging.options.logChannel,
                {
                    embed: {
                        color: 255,
                        title: `${message.author.username}#${message.author.discriminator} \`(${message.author.id})\` deleted a message!`,
                        fields: [
                            {
                                name: 'Content',
                                value: message.content
                            },
                            {
                                name: 'Deleted at',
                                value: `<t:${Math.round(Date.now() / 1000)}>`
                            }
                        ]
                    }
                }
            )
        }
    }
}
