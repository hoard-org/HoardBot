import { Client as HrdClient } from "../structures/Client.js"
import {
    Guild,
    User,
    Member,
    Message
} from 'eris';
import {
    GuildMemberLevel,
    GuildModules
} from "../structures/database/guild.js";


declare module 'eris' {
    export interface User {
        _client: HrdClient
        ensure(): Promise<void>
        getLevel(guildId: string): Promise<GuildMemberLevel | null>
    }
    export interface Member {
        _client: HrdClient;
        addXP(amount: string | number, message: Message): Promise<void>
        getLevel(): Promise<GuildMemberLevel | null>

    }
    export interface Guild {
        _client: HrdClient
        ensure(): Promise<void>
        getModules(): Promise<GuildModules>
        getAllLevels(): Promise<GuildMemberLevel[]>
    }
}

// Add guild funcs here idiot.
Guild.prototype.ensure = function (): Promise<void> {
    return this._client.db.ensureGuild(this.id)
}

Guild.prototype.getModules = function (): Promise<GuildModules> {
    return this._client.db.getGuildModules(this.id)
}

Guild.prototype.getAllLevels = function (): Promise<GuildMemberLevel[]> {
    return this._client.db.getLevels(this.id);
}

// Add user funcs here moron.
User.prototype.ensure = function (): Promise<void> {
    return this._client.db.ensureUser(this.id);
}

User.prototype.getLevel = function (guildId: string): Promise<GuildMemberLevel | null> {
    return this._client.db.getLevel(this.id, guildId)
}

// Add member funcs here stupid.
Member.prototype.addXP = async function (amount: string, message: Message): Promise<void> {
    const res = await this.user._client.db.addXP(this.user.id, this.guild.id, amount);
    if (res.levelUp) {
        this.user._client.emit('memberLevelUp', this.user.id, message, res)
    }
    return;
}

Member.prototype.getLevel = async function () {
    return this.user._client.db.getLevel(this.user.id, this.guild.id);
}