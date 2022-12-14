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

export interface LevelOptions {
    messages: {
        enabled: boolean, // whether messages are enabled or not.
        sendInDm: boolean, // whether to send message in dm or not.
        levelUp: string; // lvl up message.
    }
}

export interface GuildModules {
    levels: {
        enabled: boolean,
        options: LevelOptions
    }
}

export default class Guild {
    data: GuildData = {
        modlog: [],
        levels: []
    }
    modules: GuildModules = {
        levels: {
            enabled: true,
            options: {
                messages: {
                    enabled: true,
                    sendInDm: false, // nobody likes dm level up messages but might as well have it as an option
                    /**
                     * {@user} = User Mention
                     * {user} = User Name
                     * {guild} = Guild Name
                     * {level} = Level
                     */
                    levelUp: '{@user}, you just leveled up to level **{level}**!'
                }
            }
        }
    }
    constructor(public _id: string) { }
}