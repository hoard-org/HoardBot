import { Guild, Member } from "eris";
import { Event } from "../structures/Event.js";

export default class GuildMemberRemove extends Event {
    name = 'guildMemberRemove';

    async run(guild: Guild, member: Member) {
        // todo; Goodbye user if enabled.
        const { joinLeave, logging } = await guild.getModules();

        if (
            joinLeave.enabled && // Make sure it's enabled.
            joinLeave.options.messages.leave !== null && // Make sure that the join message isn't null.
            joinLeave.options.channel !== null && // Make sure there's a channel to send it to.
            guild.channels.has(joinLeave.options.channel) // Make sure that guild has the channel.
        ) {
            this.client.createMessage(
                joinLeave.options.channel,
                joinLeave.options.messages.leave
                    .replace(/{user}/, member.username)
                    .replace(/{@user}/, member.mention)
                    .replace(/{guild}/, guild.name)
            )
        }

        if (
            logging.enabled && // Make sure logging is enabled.
            logging.options.logChannel !== null && // Make sure log channel is set.
            logging.options.actions.members.leave && // Make sure that logging leaves is enabled.
            guild.channels.has(logging.options.logChannel) // Make sure that the guild has the channel.
        ) {
            this.client.createMessage(
                logging.options.logChannel,
                {
                    embed: {
                        color: 16711680,
                        title: `${member.username} (${member.id}) has left!`,
                        description: `Joined on ${member.joinedAt ? `<t:${Math.floor(member.joinedAt / 1000)}>` : '`unknown`'}\nLeft on <t:${Math.floor(Date.now() / 1000)}>`,
                        thumbnail: {
                            url: member.avatar ? member.defaultAvatar : member.avatarURL
                        }
                    }
                }
            )
        }
    }
}
