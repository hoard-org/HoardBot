import { CommandInteraction, InteractionDataOptionsUser } from "eris";
import { Client } from "../../../structures/client.js";
import { Command, OptionType } from "../../../structures/Command.js";

export default class extends Command {
    constructor(public client: Client) {
        super({
            name: 'avatar',
            description: 'View a member\'s avatar',
            category: 'information',
            ephemeral: false,
            options: [
                {
                    name: 'user',
                    required: false,
                    type: OptionType.USER,
                    description: 'User who\'s avatar you\'d like',
                    autocomplete: false
                }
            ]
        });
    }

    run(interaction: CommandInteraction) {
        let user = this.client.resolveUser(interaction.member!.id);

        if (interaction.data.options) {
            const option = interaction.data.options[0] as InteractionDataOptionsUser;
            user = this.client.resolveUser(option.value)
        }

        if (!user) {
            // lol wtf.
            return { content: 'No user found.' }
        }

        return {
            embed: {
                title: `${user.username}#${user.discriminator}'s avatar.`,
                image: {
                    url: !user.avatar ? user?.defaultAvatarURL : user.dynamicAvatarURL()
                }
            }
        }
    }
}