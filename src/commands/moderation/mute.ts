import { Command, OptionType } from "../../structures/Command.js";
import { Client } from "../../structures/Client.js";
import { AutocompleteInteraction, CommandInteraction, InteractionDataOptions, InteractionDataOptionsString, InteractionDataOptionsUser, InteractionDataOptionWithValue } from "eris";

const TIME_CODES = [
    {
        name: 'day',
        labels: ['day', 'd'],
        time: 8.64e7 // One day in MS
    },
    {
        name: 'hour',
        labels: ['hour', 'h'],
        time: 3.6e6
    },
    {
        name: 'minute',
        labels: ['minute', 'min', 'm'],
        time: 6e4
    },
    {
        name: 'second',
        labels: ['second', 'sec', 's'],
        time: 1e3
    },
    {
        name: 'millisecond',
        labels: ['millisecond', 'milli', 'ms'],
        time: 1
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
                },
                {
                    type: OptionType.STRING,
                    name: 'reason',
                    required: false,
                    description: 'Reason for muting the user.'
                }
            ],
            default_member_permissions: 1 << 1
        })
    }

    // todo; completely redo this. It works but it's so garbage.
    autocomplete(interaction: AutocompleteInteraction) {
        const option = interaction.data.options.find((opt) => opt.name === 'time') as InteractionDataOptionsString

        const Autocompletes: {
            value: string,
            name: string
        }[] = [];

        if (option.value === '') {
            for (const code of TIME_CODES) {
                Autocompletes.push({
                    value: code.time.toString(),
                    name: `1 ${code.name.split('')[0].toUpperCase() + code.name.split('').slice(1).join('')}`
                })
            }
        }

        const ParseTest = RegExp(/^(\d+)(?:\.(\d+)?)?\s?(.+?)$/);

        const PossibleCodes = option.value.split(' ');

        for (const PossibleCode of PossibleCodes) {
            const CodeIndex = PossibleCodes.indexOf(PossibleCode);
            if (ParseTest.test(PossibleCode)) {
                const Groups = ParseTest.exec(PossibleCode);
                if (!Groups) {
                    continue;
                }
                const TimeCode = TIME_CODES.find((code) => code.labels.includes(Groups[3]))
                if (!TimeCode) {
                    continue;
                }

                if (Autocompletes.length === 0) {
                    Autocompletes.push({
                        name: `${Groups[1]} ${TimeCode.name.split('')[0].toUpperCase() + TimeCode.name.split('').slice(1).join('')}`,
                        value: (parseInt(Groups[1]) * TimeCode.time).toString()
                    })
                } else {
                    for (const Autocompleted of Autocompletes) {
                        const index = Autocompletes.indexOf(Autocompleted);
                        Autocompletes[index].name += ` ${Groups[1]} ${TimeCode.name.split('')[0].toUpperCase() + TimeCode.name.split('').slice(1).join('')}`
                        Autocompletes[index].value = (parseInt(Autocompletes[index].value) + (parseInt(Groups[1]) * TimeCode.time)).toString()
                    }
                }

                console.log(Autocompletes);
            } else if (TIME_CODES.find((code) => code.labels.includes(PossibleCodes[CodeIndex + 1]?.toLowerCase())) && !isNaN(parseInt(PossibleCode))) {
                const TimeCode = TIME_CODES.find((code) => code.labels.includes(PossibleCodes[CodeIndex + 1].toLowerCase()))!
                if (Autocompletes.length === 0) {
                    Autocompletes.push({
                        name: `${PossibleCode} ${TimeCode.name}`,
                        value: (parseInt(PossibleCode) * TimeCode.time).toString()
                    })
                }
            };
            continue;
        }
        return Autocompletes
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

        if (user.bot) {
            return {
                content: 'You cannot mute a bot!'
            }
        }

        let time = interaction.data.options.find((opt) => opt.name === 'time') as InteractionDataOptionsString;
        let reason = interaction.data.options.find((opt) => opt.name === 'reason') as InteractionDataOptionsString

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
            content: `User: ${user.username}\n Time: ${time.value}\nReason: ${reason.value}`
        }
    }
}