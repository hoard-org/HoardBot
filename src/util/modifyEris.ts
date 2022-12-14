import { Client as HrdClient } from "../structures/Client.js"
import { Guild, User, Member, Channel, Message } from 'eris';
import { LevelOptions } from "../structures/database/guild.js";


declare module 'eris' {
    export interface User {
        _client: HrdClient
        ensure(): Promise<void>
    }
    export interface Member {
        _client: HrdClient;
        addXP(amount: string | number, message: Message): Promise<void>

    }
    export interface Guild {
        _client: HrdClient
        ensure(): Promise<void>
        levelsEnabled(): Promise<boolean>
        getLevelOptions(): Promise<LevelOptions>
    }
}

// Add guild funcs here idiot.

Guild.prototype.ensure = function (): Promise<void> {
    return this._client.db.ensureGuild(this.id)
}

Guild.prototype.levelsEnabled = function (): Promise<boolean> {
    return this._client.db.areLevelsEnabled(this.id);
}

//todo types;
Guild.prototype.getLevelOptions = function (): Promise<LevelOptions> {
    return this._client.db.getLevelOptions(this.id)
}

// Add user funcs here moron.

User.prototype.ensure = function (): Promise<void> {
    return this._client.db.ensureUser();
}

// Add member funcs here stupid.

Member.prototype.addXP = async function (amount: string, message: Message): Promise<void> {
    const res = await this.user._client.db.addXP(this.user.id, this.guild.id, amount);
    if (res.levelUp) {
        this.user._client.emit('memberLevelUp', this.user.id, message, res)
    }
    return;
}