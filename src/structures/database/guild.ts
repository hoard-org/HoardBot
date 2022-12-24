export interface GuildData {
    modlog: ModLogEntry[];
    levels: GuildMemberLevel[]
}

export enum ModLogActionTypes {
    MUTE = 0,
    KICK = 1,
    BAN = 2,
    SOFTBAN = 3,
    TIMEOUT = 4,
}

export interface ModLogEntry {
    /** Incrementing case number. */
    case: number,
    /** Offender ID */
    userId: string,
    /** Moderators ID */
    modId: string,
    /** Type of action on the user. */
    type: ModLogActionTypes
    /** Time that it happened. */
    createdAt: Date,
    /** Reason for the action */
    reason?: string
    /** Time for the action. e.g 10 minute mute.*/
    time?: string
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
        },
        modlog: {
            /** Logs member bans. */
            ban: boolean,
            /** Logs softbans. */
            softban: boolean,
            /** Logs kicks. */
            kick: boolean,
            /** Logs mutes. */
            mute: boolean,
            /** Logs timeouts. */
            timeout: boolean
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

export interface GuildOptions {
    moderation: {
        roles: {
            mute: string | null;
        }
    }
}

export class Guild {
    data: GuildData = {
        modlog: [],
        levels: []
    }

    options: GuildOptions = {
        moderation: {
            roles: {
                mute: null
            }
        }
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
                    },
                    modlog: {
                        ban: false,
                        softban: false,
                        kick: false,
                        mute: false,
                        timeout: false
                    }
                }
            }
        }
    }

    constructor(public _id: string) { }
}