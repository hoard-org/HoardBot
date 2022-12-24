import { Command, OptionType } from "../../structures/Command.js";
import { Client } from "../../structures/Client.js";
import { AutocompleteInteraction, CommandInteraction, InteractionDataOptions, InteractionDataOptionsString, InteractionDataOptionsUser, InteractionDataOptionWithValue } from "eris";

const TIME_CODES = [
    {
        name: 'day',
        labels: ['d', 'day'],
        time: 8.64e7 // One day in MS
    },
    {
        name: 'hour',
        labels: ['h', 'hour'],
        time: 3.6e6
    },
    {
        name: 'minute',
        labels: ['m', 'min', 'minute'],
        time: 6e4
    },
    {
        name: 'second',
        labels: ['s', 'sec', 'second'],
        time: 1e3
    }
]

export default class Mute extends Command {
    constructor(public client: Client) {
        super({
            name: 'mute',
            description: 'Mute a user.',
            category: 'moderation',
            options: [
                {
                    type: OptionType.USER,
                    name: 'user',
                    required: true,
                    description: 'User you\'d like to mute'
                },
                {
                    type: OptionType.STRING,
                    name: 'time',
                    required: false,
                    description: 'Time for the mute.',
                    autocomplete: true
                }
            ],
            default_member_permissions: 1 << 1
        })
    }

    autocomplete(interaction: AutocompleteInteraction) {
        // todo; type this
        const option = (interaction.data.options.find((s) => s.name === 'time')) as InteractionDataOptionsString
        console.log(option);

        if (option.value === '') {
            return [
                {
                    value: TIME_CODES.find((t) => t.name === 'day')!.time.toString(),
                    name: 'One Day (default)'
                }
            ]
        }

        const increments = option.value.split(' ');

        // todo; finish this.

        return [
            {
                value: 'test',
                name: 'test'
            }
        ]
    }

    async run(interaction: CommandInteraction) {
        if (!interaction.data.options) {
            throw new Error('Fucky wucky')
        }
        const user = this.client.resolveUser((interaction.data.options.find((opt) => opt.name === 'user') as InteractionDataOptionsUser).value);
        if (!user) {
            return {
                content: 'User not found!'
            }
        }
        let time = interaction.data.options.find((opt) => opt.name === 'time') as InteractionDataOptionsString;

        console.log(user);
        console.log(time);

        if (!time) {
            time = {
                value: TIME_CODES.find((code) => code.name === 'day')!.time.toString(),
                type: 3,
                name: 'time'
            } // just fill this in manually shrug
        }

        if (isNaN(parseInt(time.value))) {
            throw new Error('Time cannot be NaN!')
        }

        return {
            content: `User: ${user.username}\n Time: ${time.value}`
        }
    }
}