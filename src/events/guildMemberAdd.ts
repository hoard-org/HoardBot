import { Guild, Member } from "eris";
import { Event } from "../structures/Event.js";

export default class GuildMemberAdd extends Event {
    name = 'guildMemberAdd';

    run(guild: Guild, member: Member) { }
}
