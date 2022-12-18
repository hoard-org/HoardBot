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
        /** Whether messages are enabled or not. */
        enabled: boolean,
        /** Whether the message should be sent in DMs or not. */
        sendInDm: boolean,
        /** Custom level up message. */
        levelUp: string;
    }
}

export interface JoinLeaveOptions {
    /** **Channel ID** for join/leave channel */
    channel: string | null;
    /** Custom join leave messages */
    messages: {
        /** Custom join message, if **null** no message sent. */
        join: string | null,
        /** Custom leave message, if **null** no message sent. */
        leave: string | null
    },
    /** Join role options */
    roleOnJoin: {
        /** Whether to give a user a role on join. */
        enabled: boolean;
        /** An array of roles to give the user on join. Null if none. */
        role: string[] | null;
    }
}

export interface LoggingOptions {
    /** Actions to be logged. */
    logChannel: string | null,
    actions: {
        members: {
            /** Logs members joining. */
            join: boolean,
            /** Logs members leaving. */
            leave: boolean,
        }
        messages: {
            /** Logs message edits */
            edit: boolean,
            /** Logs message deletes */
            delete: boolean
        }
    }
}

export interface GuildModules {
    levels: {
        enabled: boolean,
        options: LevelOptions
    },
    joinLeave: {
        enabled: boolean
        options: JoinLeaveOptions,
    },
    logging: {
        enabled: boolean
        options: LoggingOptions
    }
}

export class Guild {
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
        },
        joinLeave: {
            enabled: false,
            options: {
                channel: null,
                messages: {
                    join: 'Welcome {user} to {guild}!',
                    leave: 'Bye {user}'
                },
                roleOnJoin: {
                    enabled: false,
                    role: null
                }
            }
        },
        logging: {
            enabled: false,
            options: {
                logChannel: null,
                actions: {
                    members: {
                        join: false,
                        leave: false
                    },
                    messages: {
                        edit: false,
                        delete: false
                    }
                }
            }
        }
    }

    constructor(public _id: string) { }
}