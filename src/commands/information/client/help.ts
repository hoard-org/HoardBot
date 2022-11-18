import { SlashCommand, OptionType } from '../../../structs/command.js';
import Client from '../../../structs/client.js';
import { CommandInteraction, TextableChannel } from 'eris';

export default class Ping extends SlashCommand {
  constructor(public client: Client) {
    super({
      name: 'help',
      description: 'View a list of all the commands',
      options: [
        {
          name: 'command',
          required: false,
          type: OptionType.STRING,
          description: 'Look at information for a specific command.',
          choices: []
        }
      ],
      category: 'information',
      ephemeral: true
    });
  }

  run(interaction: CommandInteraction<TextableChannel>) {

    if (interaction.data.options) {
      const commandName = (interaction.data.options
        .filter((f) => f.name === 'command')[0] as { value: string; type: number; name: string })
        .value;

      if (this.client.localCommands.has(commandName)) {
        const command = this.client.localCommands.get(commandName)!;
        return {
          embeds: [
            {
              title: `${
                command.data.name
                  .split('')[0]
                  .toUpperCase()
              }${
                command.data.name
                  .split('')
                  .slice(1)
                  .join('')
              }`,
              fields: [
                {
                  name: 'Description',
                  value: command.data.description ?? 'N/A'
                }
              ],
              footer: {
                text: `Category - ${
                  command.localData.category
                    .split('')[0]
                    .toUpperCase() + 
                  command.localData.category
                    .split('')
                    .slice(1)
                    .join('')
                }`
              }
            }
          ],
        };
      }
      else {
        return 'Command does not exist.';
      }
    }
    else {
      const cats: string[] = [];
      for (const command of this.client.localCommands) {
        if (command[1].localData.category && 
            !cats.includes(command[1].localData.category)) {
          cats.push(command[1].localData.category);
        }
      }
      return {
        embeds: [
          {
            title: `${this.client.user.username} Commands`,
            fields: cats.map((cat) => ({
              name: `${
                cat
                  .split('')[0]
                  .toUpperCase()
              }${
                cat
                  .split('')
                  .slice(1)
                  .join('')
              }`,
              value: `\`${
                [...this.client.localCommands]
                  .filter((cmd) => cmd[1].localData.category === cat)
                  .map((c) => c[1].data.name)
                  .join('`, `')
              }\``
            })
            )
          }
        ]
      };
    }
  }
}