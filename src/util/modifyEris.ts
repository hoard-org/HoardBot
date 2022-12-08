import { Client } from "../structures/Client.js"

declare module 'eris' {
    export interface User {
        _client: Client
        database: {
            ensure(): Promise<boolean>
        }
    }
    export interface Member {
        _client: Client;
    }
    export interface Guild {
        _client: Client
        database: {
            ensure: Promise<boolean>
        }
    }
}