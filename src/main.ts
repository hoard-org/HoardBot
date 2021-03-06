import dotenv from 'dotenv';
import Client from './structs/client.js';
dotenv.config({ path: 'config.env' });

await (new Client(`Bot ${process.env['DISCORD_TOKEN']}`, {
  messageLimit: 100,
  defaultImageFormat: 'png',
  defaultImageSize: 1024,
  restMode: true,
  intents: ['all'],
  getAllUsers: true
})).start();