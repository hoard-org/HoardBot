import {
    Interaction,
    PingInteraction,
    AutocompleteInteraction,
    CommandInteraction
} from "eris";
import { Event } from "../structures/Event.js";
import { config } from '../config.js'

export default class InteractionCreate extends Event {
    name = 'interactionCreate';

    async run(interaction: Interaction) {
        switch (interaction.type) {
            case 1: // Ping
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
        if (config.devMode.enabled && !config.devMode.allowedUsers.includes(interaction.member!.id)) {
            await interaction.acknowledge(64);
            interaction.createFollowup('I\'m sorry, but the bot is currently in **Developer Mode**. If you think this is an error please contact `Olykir#0193`.')
            return; // Don't let user run commands while bot is in developer mode.
        }

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

            // Set embed color, if no color is given. 12386559
            if (res.embed && !res.embed.color) {
                res.embed.color = 12386559
            }
            if (res.embeds) {
                for (const embed of res.embeds) {
                    const index = res.embeds.indexOf(embed);
                    if (!embed.color) {
                        res.embeds[index].color = 12386559
                    }
                }
            }

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
