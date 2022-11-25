import {
    Client,
    type ClientOptions
} from "eris";
import { logger } from "../util/index.js";

export default class extends Client {
    constructor(token: string, options?: ClientOptions) {
        super(token, options)
    }

    // Start the client;
    async start() {
        logger.info('Initializing Client...')

        await this.connect();
    }
}