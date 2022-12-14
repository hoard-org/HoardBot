import { Channel, Message } from "eris";
import { Event } from "../structures/Event.js";
import { logger } from "../util/index.js";

interface LevelData {
    levelUp: boolean,
    currentLevel: number
}

export default class MemberLeveledUp extends Event {
    name = 'memberLevelUp';
    once = false;


    async run(userID: string, message: Message, { currentLevel }: LevelData) {
        const guildOptions = await message.member?.guild.getLevelOptions();
        if (!guildOptions) {
            //lol wtf;
            return;
        }

        if (!guildOptions.messages.enabled) {
            return; // no need to continue if it's not enabled.
        }

        const messageContent = guildOptions.messages.levelUp
            .replace(/{user}/, message.author.username)
            .replace(/{@user}/, message.author.mention)
            .replace(/{level}/, currentLevel.toString())
            .replace(/{guild}/, message.member!.guild.name)

        if (guildOptions.messages.sendInDm) {
            try {
                const DMChannel = await this.client.getDMChannel(message.author.id);
                this.client.createMessage(DMChannel.id, messageContent)
            } catch { } // means nothing, could not DM user.
        } else {
            this.client.createMessage(message.channel.id, messageContent);
        }
    }
}
