import { CommandInteraction, EmbedField, InteractionDataOptionsString } from "eris";
import { Client } from "../../../structures/Client.js";
import { Command, OptionType } from "../../../structures/Command.js";

export default class Help extends Command {
    // Just store fields here so we don't have to keep remaking them.
    categories: string[] = [];
    fields: EmbedField[] = [];
    constructor(public client: Client) {
        super({
            name: 'help',
            description: 'View the bot\'s commands.',
            category: 'information',
            ephemeral: true,
            options: [
                {
                    name: 'command',
                    description: 'Command you need information for.',
                    required: false,
                    autocomplete: false,
                    type: OptionType.STRING,
                    choices: []
                }
            ]
        });

    }

    run({ data }: CommandInteraction) {
        // Just run this once because who the fuck wants to keep running it
        if (this.categories.length === 0) {
            [...this.client.localCommands].map(([, { localData: { category } }]) => {
                if (!this.categories.includes(category)) {
                    this.categories.push(category);
                }
            })

            this.categories.map((category) => {
                this.fields.push({
                    // Capitalize the category
                    name: category.split('')[0].toUpperCase() + category.split('').slice(1).join(''),
                    value: `\`${[...this.client.localCommands].map(([, command]) => (command.data.name)).join('`, `')}\``
                })
            })
        }


        if (data.options) {
            const command = this.client.localCommands.get((data.options![0] as InteractionDataOptionsString).value);
            // No reason this shouldn't exist but might as well check.
            if (!command) {
                return { content: 'An unexpected error has occured.' }
            }

            return {
                embed: {
                    title: `</${command?.data.name}:${command.data.commandId}>`,
                    fields: [
                        {
                            name: 'Description',
                            value: command.data.description ?? 'N\\A'
                        },
                        // Might add usage in later, but it's kind of ugly.
                        // {
                        //     name: 'Usage',
                        //     value: `</${command.data.name}:${command.data.commandId}>${command.data.options ? ` ${command.data.options.map((option) => `<${option.name}>`).join(' ')
                        //             }\n< > = Optional [ ] = Required` : ''
                        //         }`
                        // }
                    ],
                    footer: {
                        text: `Category - ${command.localData.category.split('')[0].toUpperCase() + command.localData.category.split('').slice(1).join('')}`
                    }
                }
            }
        }

        return {
            embed: {
                title: `${this.client.user.username}#${this.client.user.discriminator}'s commands.`,
                fields: this.fields
            }
        }
    }
}