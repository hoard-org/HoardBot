import { SlashCommand, OptionType } from '../../../structs/command.js';
import Client from '../../../structs/client.js';
import { CommandInteraction, InteractionDataOptions, InteractionDataOptionsString } from 'eris';
import fetch from 'node-fetch';
import { ValorantAccountData, ValorantMmrData } from '../../../types/valorant.js';

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
        },
        {
          name: 'region',
          required: false,
          type: OptionType.STRING,
          description: 'Region of the player',
          choices: [
            { name: 'na', value: 'na' },
            { name: 'eu', value: 'eu' },
            { name: 'ap', value: 'ap' },
            { name: 'ap', value: 'ap' },
            { name: 'br', value: 'na' },
            { name: 'latam', value: 'na' }
          ]
        }
      ],
      category: 'valorant'
    });
  }

  async run(interaction: CommandInteraction) {
    const user = ((interaction.data!.options as InteractionDataOptions[]).filter((f) => f.name === 'user')[0] as InteractionDataOptionsString).value;
    const region = ((interaction.data!.options as InteractionDataOptions[]).filter((f) => f.name === 'region')[0] as InteractionDataOptionsString) === undefined ?
      'na' : ((interaction.data!.options as InteractionDataOptions[]).filter((f) => f.name === 'region')[0] as InteractionDataOptionsString).value;


    if (!user.includes('#')) {
      return 'Invalid user.';
    }

    const name = user.split('#')[0];
    const tag = user.split('#')[1];


    const { status: accountDataStatus, data: accountData } = await this.fetchAccount(name, tag);
    const { status: mmrDataStatus, data: mmrData } = await this.fetchMMR(name, tag, region);

    if (accountDataStatus === 404 || mmrDataStatus === 404) {
      return 'Account does not exist.';
    }

    if (accountDataStatus !== 200 || mmrDataStatus !== 200) {
      return 'An error occured, this profile is likely private.';
    }

    return {
      embeds: [
        {
          author: {
            name: `${accountData!.name}#${accountData!.tag}'s statistics.`,
            icon_url: accountData!.card.small
          },
          fields: [
            {
              name: 'Rank',
              value: `${mmrData!.currenttierpatched} (${mmrData!.ranking_in_tier}${mmrData!.ranking_in_tier >= 100 ? '' : '/100'}rr)`,
              inline: true
            },
            {
              name: 'Account Level',
              value: accountData!.account_level.toString(),
              inline: true,
            }
          ],
          image: {
            url: accountData!.card.wide
          },
          footer: {
            text: `Last updated ${accountData!.last_update} || Region ${region}`
          }
        }
      ],
      flags: 0
    };

  }

  async fetchAccount(username: string, tag: string): Promise<ValorantAccountData> {
    return await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${username}/${tag}`).then((res) => res.json()) as ValorantAccountData;
  };

  async fetchMMR(username: string, tag: string, region: string = 'na'): Promise<ValorantMmrData> {
    return await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${username}/${tag}`).then((res) => res.json()) as ValorantMmrData;
  }

}   