import { Client } from 'eris';
import logger from '../util/logger.js';
import { loadFiles } from '../util/loadFiles.js';
import { ExtendedEvent } from './event.js';
import {SlashCommand, ExtendedSlashCommand } from './command.js';


export default class ExtendedClient extends Client {
  developers: string[] = [];
  localCommands = new Map<string, SlashCommand>();

  resolveUser(user: string) {
    return this.users.get(/<@!?(\d+)>/g.exec(user)?.[1] ?? user)
            ?? this.users.find((u) => u.username.toLowerCase() === user.toLowerCase());
  }

  async loadEvents() {
    const events = await loadFiles<ExtendedEvent>('../events');
    for (const eventClass of events) {
      const event = new eventClass(this);
      this.on(event.name, (...args) => event.run(...args));
      logger.info(`Loaded event '\u001b[33m${event.name}\u001b[37m'!`);
    }
  }

  async getDevelopers() {
    this.developers = process.env['DEVELOPERS']!.split(',');
    const appInfo = await this.getOAuthApplication();
    if (appInfo.team !== null) {
      for (const member of appInfo.team.members) {
        this.developers.push(member.user.id);
      }
    }
  }

  async editCommands() {
    const commands = await loadFiles<ExtendedSlashCommand>('../commands');
    for(const commandClass of commands) {
      const command = new commandClass(this);
      this.localCommands.set(command.data.name, command);
      logger.info(`Loaded command '\u001b[33m${command.data.name}\u001b[37m'`);
    }
  }

  async start() {
    logger.info('Initiating client...');
    await Promise.all([
      this.loadEvents(),
      this.editCommands(),
      this.getDevelopers()
    ]).catch((err) => {
      if (err) {
        console.error(err);
      }
    });

    logger.info('Connecting to Discord...');
    await this.connect();
  }
}