import { Message } from "eris";
import { Event } from "../structures/Event.js";

export default class MessageDelete extends Event {
    name = 'messageDelete';

    async run(message: Message) { }
}
