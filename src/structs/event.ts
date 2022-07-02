import type Client from './client.js';

export default abstract class Event { 
  abstract name: string;
  abstract run(...args: unknown[]): void;

  constructor(public client: Client) {}
}

export type ExtendedEvent = new (client: Client) => Event;