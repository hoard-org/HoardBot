import {
    AdvancedMessageContent,
    AutocompleteInteraction,
    CommandInteraction,
} from 'eris';
import { Client } from './client.js'

export type SlashCommandData = {
    /** Name of slash command */
    name: string,
    /** Description of slash command */
    description?: string;
    /** Slash command options */
    options?: OptionData[],
    /** Default slash command permissions */
    default_member_permissions?: number | string;
    /** Command ID, set by bot. */
    commandId?: string
}

export type SlashCommandConstructor = SlashCommandData & {
    category?: string;
    ephemeral?: boolean
}

export enum OptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_NEWS_THREAD = 10,
    GUILD_PUBLIC_THREAD = 11,
    GUILD_PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15
}

export type OptionData = {
    /** Type of option. */
    type: OptionType,
    /** 1-32 character name. */
    name: string,
    /** 1-100 character description. */
    description: string,
    /** If the parameter is required or optional. */
    required?: boolean,
    /** 	Choices for STRING, INTEGER, and NUMBER types for the user to pick from, max 25. */
    choices?: {
        name: string,
        value: string | number
    }[],
    /** If the option is a subcommand or subcommand group type, these nested options will be the parameters. */
    options?: OptionData,
    /** If the option is an INTEGER or NUMBER type, the minimum value permitted. */
    min_value?: number,
    /** If the option is an INTEGER or NUMBER type, the maximum value permitted */
    max_value?: number,
    /** For option type STRING, the minimum allowed length (minimum of 0, maximum of 6000). */
    min_length?: number,
    /** For option type STRING, the maximum allowed length (minimum of 1, maximum of 6000). */
    max_length?: number,
    /** If autocomplete interactions are enabled for this STRING, INTEGER, or NUMBER type option. */
    autocomplete?: boolean,
    /** If the option is a channel type, the channels shown will be restricted to these types. */
    channel_types?: ChannelTypes[]
}

export type LocalCommandData = {
    /** Local ID for the command. Not used for much. */
    id: string;
    /** Category the command is in. */
    category: string;
    /** Whether the command should be ephemeral or not. */
    ephemeral: boolean;
}

export abstract class Command {
    data: SlashCommandData;
    localData!: LocalCommandData;
    constructor({
        name,
        description,
        options,
        category = 'miscellaneous',
        ephemeral = true,
        default_member_permissions = 1 << 11
    }: SlashCommandConstructor) {
        this.data = {
            name,
            description,
            options,
            default_member_permissions: default_member_permissions.toString() // Make sure it's a string just in case.
        }
        this.localData = {
            category,
            ephemeral,
            id: `${this.constructor.name}-${name}`
        }
    }

    autocomplete?(interaction: AutocompleteInteraction): { name: string, value: string }[]

    abstract run(interaction: CommandInteraction, middlewareData?: unknown): AdvancedMessageContent | Promise<AdvancedMessageContent>;
}

export type ExtendedCommand = new (client: Client) => Command
