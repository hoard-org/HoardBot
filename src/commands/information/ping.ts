import { Client } from "../../structures/client.js";
import { Command } from "../../structures/Command.js";

export default class extends Command {
    constructor(public client: Client) {
        super({
            name: 'ping',
            description: 'View the bots response time.',
            category: 'information',
            ephemeral: true
        });
    }

    run() {
        const ping = this.client.shards.get(0)?.latency === Infinity ? '0' : this.client.shards.get(0)?.latency;
        return {
            content: `${ping}ms`
        };
    }
}