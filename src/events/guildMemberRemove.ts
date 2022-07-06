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
          .replace('{user}', `<@${member.id}>`)
          .replace('{guild}', guild.name)
      );   
    }
  }
}