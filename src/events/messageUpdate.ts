import { Message } from "eris";
import { Event } from "../structures/Event.js";

export default class EditMessage extends Event {
    name = 'messageUpdate';

    async run(message: Message, oldMessage?: Message) { }
}
