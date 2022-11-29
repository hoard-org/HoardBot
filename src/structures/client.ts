import {
    Client as ErisClient,
    type ClientOptions
} from "eris";
import { logger } from "../util/index.js";

export class Client extends ErisClient {
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
     * Start the client.
     */
    async start() {
        logger.info('Initializing Client...')

        await this.connect();
    }
}