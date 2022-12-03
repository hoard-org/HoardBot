import { Interaction, PingInteraction, AutocompleteInteraction, CommandInteraction } from "eris";
import { Event } from "../structures/Event.js";
import { logger } from "../util/index.js";

export default class InteractionEvent extends Event {
    name = 'interactionCreate';
    once = true;

    async run(interaction: Interaction) {
        switch (interaction.type) {
            case 1: // Ping
                logger.debug('Interaction ping has been acknowledged.')
                this.doPing(interaction as PingInteraction);
                break;
            case 2: // Application Command
                this.doCommand(interaction as CommandInteraction)
                break;
            case 3: // Message Component
                this.doComponent()
                break;
            case 4: // Autocomplete
                this.doAutocomplete(interaction as AutocompleteInteraction)
                break;
        }
    }

    async doPing(interaction: PingInteraction) {
        await interaction.acknowledge();
        interaction.pong();
    }

    async doCommand(interaction: CommandInteraction) {
        try {
            const command = this.client.localCommands.get(interaction.data.name);
            if (!command) {
                // This *should* be impossible but who the fuck knows.
                await interaction.acknowledge(64);
                interaction.createFollowup('An unexpected error has occured! Please contact `Olykir#0193`.');
            }
            await interaction.acknowledge(command!.localData.ephemeral ? 64 : 0);
            // No reason why there shouldn't be a run function.
            const res = await command!.run(interaction);
            console.log(res);
            interaction.createFollowup(res);
        } catch (e) {
            // just in case.
            console.error(e);
            interaction.acknowledge(64);
            interaction.createFollowup('An unexpected error has occured! Please contact `Olykir#0193`.')
        }
    }

    doComponent() { } // TODO;

    doAutocomplete(interaction: AutocompleteInteraction) { } // TODO;
}
