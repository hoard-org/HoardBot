import Client from './client.js';
import { AdvancedMessageContent, CommandInteraction, MessageContent } from 'eris';

export type SlashCommandData = {
  name: string,
  description?: string,
  options?: OptionData[]
};

export type SlashCommandConstructor = {
  name: string,
  description?: string,
  options?: OptionData[],
  category?: string,
  ephemeral?: boolean; 
};

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

enum ChannelTypes {
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
  autocomplete?: boolean,
  channel_types?: ChannelTypes[]
};

export abstract class SlashCommand {
  data: SlashCommandData;
  localData: { category: string; ephemeral: boolean }
  constructor({
    name,
    description,
    options,
    category = 'miscellaneous',
    ephemeral = false
  }: SlashCommandConstructor) {
    this.data = {
      name,
      description,
      options
    };

    this.localData = {
      category,
      ephemeral
    };
  }

  abstract run(interaction: CommandInteraction): MessageContent | AdvancedMessageContent | Promise<MessageContent | AdvancedMessageContent>;
}

export type ExtendedSlashCommand = new (client: Client) => SlashCommand;