import { AdvancedMessageContent, CommandInteraction } from 'eris';
import { Client } from './client.js'

export type SlashCommandData = {
    name: string,
    description?: string;
    options?: OptionData[],
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
    type: OptionType,
    name: string,
    description: string,
    required?: boolean,
    choices?: {
        name: string,
        value: string | number
    }[],
    options?: OptionData,
    min_value?: number,
    max_value?: number,
    autocomplete: boolean,
    channel_types?: ChannelTypes[]
}

export type LocalCommandData = {
    id: string;
    category: string;
    ephemeral: boolean;
}

export abstract class Command {
    data: SlashCommandData;
    localData: LocalCommandData;

    // Should just be used for fetching data, but can be used for anything.

    constructor({
        name,
        description,
        options,
        category = 'miscellaneous',
        ephemeral = true
    }: SlashCommandConstructor) {
        this.data = {
            name,
            description,
            options
        }
        this.localData = {
            category,
            ephemeral,
            id: `${this.constructor.name}-${name}`
        }
    }

    middleware?(interaction: CommandInteraction): unknown

    abstract run(interaction: CommandInteraction, middlewareData?: unknown): AdvancedMessageContent | Promise<AdvancedMessageContent>;
}

export type ExtendedCommand = new (client: Client) => Command
