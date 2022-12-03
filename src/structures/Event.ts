import type { Client } from "./client";

export abstract class Event {
    abstract name: string;
    once: boolean = false;
    abstract run(...args: unknown[]): void;

    constructor(public client: Client) {};
}

export type ExtendedEvent = new (client: Client) => Event