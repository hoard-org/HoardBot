import { Client } from "../../structures/Client.js";
import { Command, OptionType } from "../../structures/Command.js";

export default class Help extends Command {
    constructor(public client: Client) {
        super({
            name: 'help',
            description: 'View the bot\'s commands.',
            category: 'information',
            ephemeral: true,
            options: [
                {
                    name: 'command',
                    description: 'todo',
                    required: false,
                    autocomplete: true,
                    type: OptionType.STRING,
                    choices: []
                }
            ]
        })
    }

    run() {
        return {
            embed: {
                title: 'help'
            }
        }
    }
}