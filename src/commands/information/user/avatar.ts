import { SlashCommand } from '../../../structs/command.js';
import Client from '../../../structs/client.js';
import { CommandInteraction, InteractionDataOptionsUser, TextableChannel } from 'eris';

export default class Ping extends SlashCommand {
  constructor(public client: Client) {
    super({
      name: 'avatar',
      description: 'View the avatar of a person',
      options: [
        {
          type: 6,
          name: 'user',
          description: 'User who\'s avater you\'d like to see.',
          required: true
        }
      ]
    });
  }

  run({data}: CommandInteraction<TextableChannel>) {
    const user = this.client.resolveUser((data.options![0] as InteractionDataOptionsUser).value);
    return {
      embeds: [
        {
          title: `${user?.username}#${user?.discriminator}'s avatar!`,
          image: {
            url: !user?.avatar ? user?.defaultAvatar : user?.dynamicAvatarURL()
          },
        }
      ]
    };
  }
}   