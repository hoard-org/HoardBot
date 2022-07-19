import { Message } from 'eris';
import Event from '../structs/event.js';


export default class messageUpdate extends Event {
  name = 'messageUpdate';

  async run(message: Message, oldMessage: Message) {
    if(message.guildID === process.env['HRD_ID']) {
    
      if(!message.author || message.author.bot || !message.content) {
        return;
      }

      this.client.createMessage(
        process.env['HRD_LOG_CHANNEL']!,
        {
          content: `Message edited in <#${message.channel.id}> (${message.channel.id})

Author: <@${message.author.id}> (${message.author.id})
Timestamp: <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>),
Old Message Content: \`\`\`
${oldMessage.content}
\`\`\`
New Message Content: \`\`\`
${message.content}
\`\`\``
        }
      );
    }
  }
}