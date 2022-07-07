import Event from '../structs/event.js';
import { 
  PingInteraction, 
  CommandInteraction, 
  ComponentInteraction, 
  AutocompleteInteraction, 
  UnknownInteraction
} from 'eris';

export default class InteractionCreateEvent extends Event {
  name = 'interactionCreate';

  async run(
    interaction: PingInteraction | CommandInteraction | ComponentInteraction | AutocompleteInteraction | UnknownInteraction
  ) {
    switch(interaction.type) {
      case 1:
        await this.handlePingInteraction(interaction as PingInteraction);
        break;
      case 2:
        await this.handleCommandInteraction(interaction as CommandInteraction);
        break;
      case 3:
        // message component
        break;
    }        
  }


  async handleCommandInteraction(interaction: CommandInteraction) {
    const command = this.client.localCommands.get(interaction.data.name);  
    const res = await command?.run(interaction);
    if(res) {
      if(typeof res === 'string') {
        interaction.createMessage({flags: 64, content: res});
      }
      else if(typeof res === 'object') {
        if(res?.embeds) {
          for(const [index, embed] of res.embeds.entries()) {
            if(!embed.color) {
              res.embeds[index].color = 12473343;
            }
          }
        }
        interaction.createMessage({flags: 64, ...res});
      }
    }

  }

  async handlePingInteraction(interaction: PingInteraction) {
    interaction.acknowledge();
  }
}

