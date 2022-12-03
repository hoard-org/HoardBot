import { ApplicationCommandStructure } from "eris";
import { Event } from "../structures/Event.js";
import { logger } from "../util/index.js";

export default class ReadyEvent extends Event {
    name = 'ready';
    once = true;

    async run() {
        const { username, discriminator } = this.client.user;
        logger.debug(`Logged in as ${username}#${discriminator}`)

        const bulkCommands = [...this.client.localCommands].map((c) => c[1].data);
        for (const [index, command] of bulkCommands.entries()) {
            if (command.name === 'help') {
                bulkCommands[index].options![0].choices = [...this.client.localCommands]
                    .slice(0, 25)
                    .map((f) => ({
                        name: f[1].data.name,
                        value: f[1].data.name
                    }))
            }
        }

        this.client.bulkEditCommands(bulkCommands as ApplicationCommandStructure[]);
    }
}
