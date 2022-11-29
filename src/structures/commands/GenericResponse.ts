import { CommandInteraction, MessageContent, AdvancedMessageContent } from 'eris';
import { Base } from './Base';

export abstract class GenericResponse extends Base {
    abstract run(interaction: CommandInteraction): MessageContent | AdvancedMessageContent
}