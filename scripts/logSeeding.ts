#!/usr/bin/env node
/* eslint-disable no-underscore-dangle */

/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'node:fs';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

type Log = Record<
  string,
  {
    name: string;
    count: number;
  }
>;

type SteamBans = {
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
  has_bans: boolean;
};

type PlayerInfo = {
  name: string;
  steam_id_64: string;
  country: string | null; // You can replace 'string' with the actual type of country if available
  steam_bans: SteamBans;
};

type GetPlayersFastDTO = {
  result: PlayerInfo[];
  command: string;
  arguments: Record<string, any>;
  failed: boolean;
  error: string;
  forward_results: any | null; // Replace 'any' with a specific type if needed
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const token = 'e29e1662-976a-403a-b19f-12e05e1ef4b8';
const filename = `${__dirname}/log.json`;

async function logSeeding() {
  const hour = new Date().getHours();

  if (hour < 7 || hour > 18) {
    return;
  }

  try {
    const content = fs.readFileSync(filename, 'utf8');
    const log = JSON.parse(content.toString()) as Log;

    console.log('Seed checker: log loaded');

    for (const server of [1, 2]) {
      const res = await fetch(
        `https://rcon${server}.82nd.gg/api/get_players_fast`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '',
          },
        },
      );

      const dto = (await res.json()) as GetPlayersFastDTO;
      const players = dto.result;

      if (!Array.isArray(players) || players.length >= 60) {
        console.log(`Seed checker: server ${server} is full or not responding`);

        if (Array.isArray(players)) {
          console.log(`Seed checker: Number of players: ${players.length}`);
        } else {
          console.log(`Seed checker: Players object: ${players}`);
        }

        continue;
      }

      const additions: Log = players.reduce(
        (acc, player) => ({
          ...acc,
          [player.steam_id_64]: {
            name: player.name,
            count: 1,
          },
        }),
        {},
      );

      console.log(
        `Seed checker: ${
          Object.keys(additions).length
        } seeders registered on server ${server}`,
      );

      Object.entries(additions).forEach(([steamId, player]) => {
        if (steamId in log) {
          log[steamId].count += 1;
        } else {
          log[steamId] = player;
        }
      });
    }

    await fs.writeFileSync(filename, JSON.stringify(log));

    console.log('Seed checker: log updated');
    console.log('---------------------------');
  } catch (err: unknown) {
    console.error(
      `Seed checker: ${typeof err === 'string' ? err : (err as Error).message}`,
    );
    console.log('---------------------------');
  }
}

setInterval(logSeeding, 1000 * 60 * 5);
