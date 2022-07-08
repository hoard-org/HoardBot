import { SlashCommand } from '../../../structs/command.js';
import Client from '../../../structs/client.js';
import {parseUptime, formatNumber} from '../../../util/index.js';

export default class Status extends SlashCommand {
  constructor(public client: Client) {
    super({
      name: 'status',
      description: 'Check the bot\'s status.',
      category: 'information'
    });
  }

  run() {
    return {
      embeds: [
        {
          title: `${this.client.user.username}#${this.client.user.discriminator} status`,
          fields: [
            {
              name: 'Guilds',
              value: formatNumber(this.client.guilds.size),
              inline: true
            },
            {
              name: 'Users',
              value: formatNumber(this.client.users.size),
              inline: true,
            },
            {
              name: 'Memory Usage',
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, 
              inline: true
            },
            {
              name: 'Uptime',
              value: parseUptime(this.client.uptime / 1000)
            }
          ],
          footer: {
            text: `Ping: ${this.client.shards.get(0)?.latency === Infinity ? 
              '0' : 
              this.client.shards.get(0)?.latency
            }ms`
          }
        }
      ]
    };
  }
}   