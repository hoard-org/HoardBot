import { CommandInteraction, Embed } from 'eris';
import { Base } from './Base';

export abstract class GenericEmbedResponse extends Base {
    abstract run(interaction: CommandInteraction): Embed
}