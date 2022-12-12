import {
    ApplicationCommandStructure,
    Client as ErisClient,
    type ClientOptions
} from "eris";
import { loadFiles, logger } from "../util/index.js";
import { type ExtendedEvent } from "./Event.js";
import { config } from "../config.js";
import { Command, ExtendedCommand } from "./Command.js"
import Database from "../util/database.js";

export class Client extends ErisClient {
    developers: string[] = config.developers;
    localCommands = new Map<string, Command>();
    // Should never not exist after startup
    db!: Database;

    constructor(token: string, options?: ClientOptions) {
        super(token, options)
    }

    /**
     * Fetch a user from the bot.
     * @param user User filter. Could be ID or Name.
     */
    resolveUser(user: string) {
        return this.users.get(/<@!?(\d+)>/g.exec(user)?.[1] ?? user)
            ?? this.users.find((u) => u.username.toLowerCase() === user.toLowerCase());
    }

    /**
     * Load all events.
     */
    async loadEvents() {
        const events = await loadFiles<ExtendedEvent>('../events');
        for (const eventClass of events) {
            const event = new eventClass(this);
            // Why not tbh.
            if (event.once) {
                this.once(event.name, (...args) => event.run(...args));
            } else {
                this.on(event.name, (...args) => event.run(...args));
            }
            logger.info(`Event '${event.name}' loaded successfully.`)
        }
    }

    /**
     * Load all commands.
     */
    async loadCommands() {
        const commands = await loadFiles<ExtendedCommand>('../commands');
        for (const commandClass of commands) {
            const command = new commandClass(this);
            this.localCommands.set(command.data.name, command);
            logger.info(`Loaded command '${command.data.name}'.`)
        }
    }


    /**
     * Start the client.
     */
    async start() {
        logger.debug('Initializing Client...')
        await this.loadEvents();
        await this.loadCommands();
        this.db = new Database()
        await this.db.start();
        // Connect last.
        await this.connect();
    }
}