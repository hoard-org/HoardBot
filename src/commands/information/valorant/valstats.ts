import { SlashCommand, OptionType } from '../../../structs/command.js';
import Client from '../../../structs/client.js';
import { CommandInteraction, InteractionDataOptionsString } from 'eris';
import fetch from 'node-fetch';

type gDataType = {
  puuid: string,
  region: string,
  account_level: number,
  name: string,
  tag: string,
  card: {
    small: string,
    large: string,
    wide: string,
    id: string
  },
  last_update: string
};

export default class ValStats extends SlashCommand {
  constructor(public client: Client) {
    super({
      name: 'valstats',
      description: 'Check a user\'s VALORANT statistics.',
      options: [
        {
          name: 'user',
          required: true,
          type: OptionType.STRING,
          description: 'User to find.'
        }
      ],
      category: 'valorant'
    });
  }

  run(interaction: CommandInteraction) {
    const user = (interaction.data!.options![0] as InteractionDataOptionsString)
      .value;
      
    if(!user.includes('#')) {
      return 'Invalid user.';
    }

    const name = user.split('#')[0];
    const tag = user.split('#')[1];


    return 'wip';

  }
}   