import { Guild, Member } from "eris";
import { Event } from "../structures/Event.js";

export default class GuildMemberRemove extends Event {
    name = 'guildMemberRemove';

    run(guild: Guild, member: Member) { }
}
