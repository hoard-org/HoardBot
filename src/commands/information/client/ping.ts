import { SlashCommand } from '../../../structs/command.js';
import Client from '../../../structs/client.js';

export default class Ping extends SlashCommand {
  constructor(public client: Client) {
    super({
      name: 'ping',
      description: 'A basic ping command.',
      category: 'information',
      ephemeral: true
    });
  }

  run() {
    return {
      embeds: [
        {
          title: `Pong! ${
            this.client.shards.get(0)?.latency === Infinity ? 
              '0' : 
              this.client.shards.get(0)?.latency
          }ms`, 
        }
      ]
    };
  }
}   