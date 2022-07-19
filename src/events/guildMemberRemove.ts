import Event from '../structs/event.js';
import { Guild, Member } from 'eris';

const Messages = [
  'Bye, {user}!',
];

export default class guildMemberRemove extends Event {
  name = 'guildMemberRemove';

  async run(guild: Guild, member: Member) {
    if(guild.id === process.env['HRD_ID']) {    
      this.client.createMessage(
        process.env['HRD_JOIN_LEAVE']!, 
        Messages[Math.floor(Math.random() * Messages.length)]
          .replace(/{user}/gi, `<@${member.id}>`)
          .replace(/{guild}/gi, guild.name)
      );   

      // logger pogger
      this.client.createMessage(
        process.env['HRD_LOG_CHANNEL']!,
        {
          embeds: [
            {
              title: `${member.user.username}#${member.user.discriminator} (${member.id}) left.`,
              thumbnail: {
                url: !member.user?.avatar ? 
                  member.user?.defaultAvatar : 
                  member.user?.dynamicAvatarURL()
              },
              description: `<t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
              color: 12473343
            }
          ]
        }
      );
    }
  }
}