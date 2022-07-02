import Event from '../structs/event.js';
import logger from '../util/logger.js';

export default class ReadyEvent extends Event {
  name = 'ready';

  async run() {
    const { username, discriminator } = this.client.user;
    logger.info(`${username}#${discriminator} is now online!`);
    // add the commands.
    const bulkCommands = [...this.client.localCommands].map((c) => c[1].data);
    for(const [index, command] of bulkCommands.entries()) {
      if(command.name === 'help') {
        bulkCommands[index].options![0].choices = [...this.client.localCommands]
          .slice(0, 25)
          .map((f) => (
            {
              name: f[1].data.name, 
              value: f[1].data.name
            }
          ));
      }
    }
    // eslint-disable-next-line 
    this.client.bulkEditCommands(bulkCommands as any);
  }
}