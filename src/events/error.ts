import { ApplicationCommandStructure } from "eris";
import { Event } from "../structures/Event.js";
import { logger } from "../util/index.js";

export default class Error extends Event {
    name = 'error';

    async run(err: Error, id: number) {
        logger.error(`Error: ${id}\n${err}`)
    }
}
