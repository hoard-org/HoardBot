import { CommandInteraction, InteractionDataOptionsString } from "eris";
import { Command, OptionType } from "../../../structures/Command.js";

const PossibleResponses = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes definitely.',
    'You may rely on it.',
    'As i see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'Outlook not so good',
    'Very doubtful.'
]

export default class EightBall extends Command {
    constructor() {
        super({
            name: '8ball',
            description: 'Ask the magic 8Ball something.',
            ephemeral: true,
            category: 'fun',
            options: [{
                type: OptionType.STRING,
                name: 'question',
                required: true,
                description: 'Question for the magic 8Ball.'
            }]
        })
    }

    run({ data }: CommandInteraction) {
        return {
            embed: {
                title: PossibleResponses[Math.floor(Math.random() * PossibleResponses.length)],
                description: `Question: ${(data.options![0] as InteractionDataOptionsString).value}`
            }
        }
    }
}