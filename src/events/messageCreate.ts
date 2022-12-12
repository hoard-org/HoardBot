import { Message, GuildTextableChannel } from "eris";
import { Event } from "../structures/Event.js";
import { logger } from "../util/index.js";

export default class MessageCreate extends Event {
    name = 'messageCreate';
    once = false;

    async run(message: Message) {
        switch (message.type) {
            /** Guild message */
            case 0:
                if (!message.member) {
                    // lol wtf
                    return;
                }
                await message.member.guild.ensure();
                break;
        }
    }
}
