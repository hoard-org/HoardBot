import { Client as HrdClient } from "../structures/Client.js"
import { Guild, User } from 'eris';

declare module 'eris' {
    export interface User {
        _client: HrdClient
        ensure(): Promise<void>
    }
    export interface Member {
        _client: HrdClient;

    }
    export interface Guild {
        _client: HrdClient
        ensure(): Promise<void>
    }
}

// Add guild funcs here idiot.

Guild.prototype.ensure = function (): Promise<void> {
    return this._client.db.ensureGuild(this.id)
}

// Add user funcs here moron.

User.prototype.ensure = function (): Promise<void> {
    return this._client.db.ensureUser();
}