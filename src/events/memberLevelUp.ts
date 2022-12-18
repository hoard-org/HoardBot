import { Message } from "eris";
import { Event } from "../structures/Event.js";

interface LevelData {
    levelUp: boolean,
    currentLevel: number
}

export default class MemberLeveledUp extends Event {
    name = 'memberLevelUp';

    async run(_: string, message: Message, { currentLevel }: LevelData) {
        const { levels } = await message.member!.guild.getModules();
        if (!levels) {
            //lol wtf;
            return;
        }

        if (!levels.options.messages.enabled) {
            return; // no need to continue if it's not enabled.
        }

        const messageContent = levels.options.messages.levelUp
            .replace(/{user}/, message.author.username)
            .replace(/{@user}/, message.author.mention)
            .replace(/{level}/, currentLevel.toString())
            .replace(/{guild}/, message.member!.guild.name)

        if (levels.options.messages.sendInDm) {
            try {
                const DMChannel = await this.client.getDMChannel(message.author.id);
                this.client.createMessage(DMChannel.id, messageContent)
            } catch { } // means nothing, could not DM user.
        } else {
            this.client.createMessage(message.channel.id, messageContent);
        }
    }
}
