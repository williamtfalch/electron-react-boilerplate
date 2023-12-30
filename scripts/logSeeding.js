#!/usr/bin/env node

/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'node:fs';
import fetch from 'node-fetch';

const token = 'e29e1662-976a-403a-b19f-12e05e1ef4b8';
const filename = 'log.json';

async function logSeeding() {
  const hour = new Date().getHours();

  if (hour < 7 || hour > 18) {
    return;
  }

  try {
    const content = fs.readFileSync(filename, 'utf8');
    const log = JSON.parse(content.toString());

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

      const dto = (await res.json());
      const players = dto.result;

      if (!Array.isArray(players) || players.length >= 60) {
        console.log(
          `Seed checker: ${Array.isArray(players)} and ${players.length}`,
        );
        continue;
      }

      const additions = players.reduce(
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
  } catch (err) {
    console.error(
      `Seed checker: ${typeof err === 'string' ? err : (err as Error).message}`,
    );
    console.log('---------------------------');
  }
}

setInterval(logSeeding, 1000 * 60 * 5);
