import { Guild, Member } from "eris";
import { Event } from "../structures/Event.js";

export default class GuildMemberAdd extends Event {
    name = 'guildMemberAdd';

    async run(guild: Guild, member: Member) {
        const { joinLeave, logging } = await guild.getModules();

        if (
            joinLeave.enabled && // Make sure it's enabled.
            joinLeave.options.messages.join !== null && // Make sure the join message isn't null.
            joinLeave.options.channel !== null && // Make sure there's a channel to send it to.
            guild.channels.has(joinLeave.options.channel) // Make sure that guild has the channel.
        ) {
            this.client.createMessage(
                joinLeave.options.channel,
                joinLeave.options.messages.join
                    .replace(/{user}/, member.username)
                    .replace(/{@user}/, member.mention)
                    .replace(/{guild}/, guild.name)
            )

            if (
                joinLeave.options.roleOnJoin.enabled &&
                joinLeave.options.roleOnJoin.role !== null
            ) {
                for (const role of joinLeave.options.roleOnJoin.role) {
                    member.addRole(role, 'Role automatically to user on join.')
                }
            }
        }

        if (
            logging.enabled && // Make sure logging is enabled.
            logging.options.logChannel !== null && // Make sure log channel is set.
            logging.options.actions.members.join && // Make sure that logging joins is enabled.
            guild.channels.has(logging.options.logChannel) // Make sure that the guild has the channel.
        ) {
            this.client.createMessage(
                logging.options.logChannel,
                {
                    embed: {
                        color: 65280,
                        title: `${member.username} (${member.id}) has joined!`,
                        description: `Joined on <t:${Math.floor(Date.now() / 1000)}>`,
                        thumbnail: {
                            url: member.avatar ? member.defaultAvatar : member.avatarURL
                        }
                    }
                }
            )
        }
    }
}
