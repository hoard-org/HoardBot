import { Message } from 'eris';
import Event from '../structs/event.js';


export default class messageDelete extends Event {
  name = 'messageDelete';

  async run(message: Message) {
    if(message.guildID === process.env['HRD_ID']) {

        
      if(!message.author || message.author.bot) {
        return;
      }



      this.client.createMessage(
        process.env['HRD_LOG_CHANNEL']!,
        {
          content: `Message deleted in <#${message.channel.id}> (${message.channel.id})

Author: <@${message.author.id}> (${message.author.id})
Timestamp: <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>),

Message Content: \`\`\`
${message.content}
\`\`\``
        }
      );
    }
  }
}