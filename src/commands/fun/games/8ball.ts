import { SlashCommand, OptionType } from "../../../structs/command.js";
import type Client from '../../../structs/client.js';
import { CommandInteraction, TextableChannel } from "eris";

const Responses = [
    // Affirmative
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes, definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    // Non-Committal
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    // Negative
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Very doubtful.'
]

export default class EightBall extends SlashCommand {
    constructor(public client: Client) {
        super({
            name: '8ball',
            description: 'Ask the 8ball a question.',
            options: [
                {
                    name: 'question',
                    required: true,
                    type: OptionType.STRING,
                    description: 'What do you want to ask?'
                }
            ],
            category: 'fun'
        })
    }

    run(interaction: CommandInteraction<TextableChannel>) {
        // No real need for logic here. Just return a random response.
        return {
            embeds: [
                {
                    fields: [
                        {
                            name: 'Question',
                            // @ts-ignore; Not sure why .value isn't typed but whatever. It's not like it wouldn't be there anyways since the option is required. But I get it.
                            value: interaction.data.options?.find((f) => f.name === 'question').value
                        },
                        {
                            name: 'Response',
                            value: Responses[Math.floor(Math.random() * Responses.length)]
                        }
                    ]
                }
            ]
        };
    }
}