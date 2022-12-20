import { Message } from "eris";
import { Event } from "../structures/Event.js";

export default class EditMessage extends Event {
    name = 'messageUpdate';

    async run(message: Message, oldMessage?: Message) {
        if (message.author.bot || message.channel.type === 1) return; // don't log bots.
        const guild = this.client.guilds.get(message.guildID!);
        if (!guild) {
            throw new Error(`Not in guild '${message.guildID}'`)
        }
        const { logging } = await this.client.guilds.get(message.guildID!)!.getModules()

        if (
            logging.enabled && // Make sure logging is enabled.
            logging.options.actions.messages.edit && // Make sure logging edits is enabled.
            logging.options.logChannel !== null && // Make sure there is a log channel set.
            guild.channels.has(logging.options.logChannel) // Make sure that the log channel exists.
        ) {
            this.client.createMessage(
                logging.options.logChannel,
                {
                    embed: {
                        color: 255,
                        title: `${message.author.username}#${message.author.discriminator} \`(${message.author.id})\` edited a message!`,
                        fields: [
                            {
                                name: 'Old Content',
                                value: oldMessage?.content ?? 'Unknown (Message was not cached. Sorry!)'
                            },
                            {
                                name: 'New Content',
                                value: message.content
                            },
                            {
                                name: 'Edited at',
                                value: `<t:${Math.round(Date.now() / 1000)}>`
                            }
                        ],
                        footer: {
                            text: `Message ID: ${message.id}`
                        }
                    }
                }
            )
        }
    }
}
