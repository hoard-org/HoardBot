import Event from '../structs/event.js';
import logger from '../util/logger.js';

export default class ReadyEvent extends Event {
  name = 'ready';

  async run() {
    const { username, discriminator } = this.client.user;
    logger.info(`${username}#${discriminator} is now online!`);
    // add the commands.
    // eslint-disable-next-line 
    this.client.bulkEditCommands([...this.client.localCommands].map((c) => c[1].data) as any)
  }
}