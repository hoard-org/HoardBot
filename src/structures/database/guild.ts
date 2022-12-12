export interface GuildData {
    modlog: Modlog[];
    levels: GuildMemberLevel[]
}

export interface Modlog {
    // todo;
}

export interface GuildMemberLevel {
    /** User Id */
    _id: string,
    /** User's XP */
    xp: string,
    /** User's level */
    level: string,
}

export default class Guild {
    data: GuildData = {
        modlog: [],
        levels: []
    }
    constructor(public _id: string) { }
}