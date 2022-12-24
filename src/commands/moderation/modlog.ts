import { Command, OptionType } from "../../structures/Command.js";
import { Client } from "../../structures/Client.js";
import { CommandInteraction, InteractionDataOptionsUser } from "eris";

export default class ModLog extends Command {
    constructor(public client: Client) {
        super({
            name: 'modlog',
            description: 'See a user\'s modlog entries.',
            category: 'moderation',
            options: [
                {
                    type: OptionType.USER,
                    name: 'user',
                    required: true,
                    description: 'User you\'d like to see.'
                }
            ],
            default_member_permissions: 1 << 7
        })
    }

    async run({ data, member }: CommandInteraction) {
        if (!member) {
            throw new Error('Interaction member does not exist. Modlog command.')
        }
        const modlog = await member.guild.getModLog()
        if (!data.options) {
            throw new Error('Interaction options do not exist. Modlog Command.');
        }
        // No reason the options should be undefined.
        const usrModlog = modlog.filter((entry) => entry.userId === (data.options![0] as InteractionDataOptionsUser).value)

        if (usrModlog.length === 0) {
            return {
                content: 'No modlog entries.'
            }
        }

        return {
            content: 'you can run this!'
        }
    }
}