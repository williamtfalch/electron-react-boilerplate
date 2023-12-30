/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import { Outlet, Link } from 'react-router-dom';
import classNames from 'classnames';
import React from 'react';
import useSWR from 'swr';
import styles from './styles.module.css';
import { Input } from '../input/input';
import { Picker } from '../picker/picker';
import type {
  PlayersHistory,
  Player as PlayerInfo,
} from '../../types/players_history';
import { GetScoreboardMapsDTO } from '../../types/get_scoreboard_maps';
import {
  PlayerStats,
  GetMapScoreboardDTO,
} from '../../types/get_map_scoreboard';
import { periodToEpoch } from '../../constants';
import { LoadingIcon } from '../loadingIcon/loadingIcon';
import { getMedian } from '../../utils';

type KeyStats = {
  numKills: number;
  numDeaths: number;
  playTime: number;
  favouriteWeapons: Record<string, number>;
};

type PlayerStatistics = {
  games: Array<PlayerStats>;
  summary: KeyStats;
};

export function Scout() {
  const [mapIds, setMapIds] = React.useState<Array<number>>([]);
  const [playtimeThreshold, setPlaytimeThreshold] = React.useState(20);
  const [numGamesThreshold, setNumGamesThreshold] = React.useState(10);
  const [minKillsThreshold, setMinKillsThreshold] = React.useState(5);
  const [periodThreshold, setPeriodThreshold] = React.useState(['3M']);
  const [profile, setProfile] = React.useState(['infantry']);
  const [numTopPlayers, setNumTopPlayers] = React.useState(30);
  const [formattedPlayerStats, setFormattedPlayerStats] = React.useState<
    Record<
      string,
      {
        games: Array<PlayerStats>;
        summary: {
          numKills: number;
          numDeaths: number;
          playtime: number;
          favouriteWeapons: Record<string, number>;
        };
      }
    >
  >({});
  const [servers, setServers] = React.useState(['1', '2']);
  const [numPages, setNumPages] = React.useState(10);
  const [urls, setUrls] = React.useState<Array<string>>([]);
  const [steamIds, setSteamIds] = React.useState<Record<string, string>>({});

  const {
    data: gameMetadataDTO,
    error: gameMetadataDTOError,
    isLoading: gameMetadataDTOLoading,
  } = useSWR(urls, async () =>
    Promise.all(
      urls.map(async (url) => {
        const res = await fetch(url);

        const decoded = (await res.json()) as GetScoreboardMapsDTO;

        return decoded.result.maps;
      }),
    ),
  );

  const {
    data: gameDetails,
    error: gameDetailsError,
    isLoading: gameDetailsLoading,
  } = useSWR(mapIds, async (ids) =>
    Promise.all(
      ids.map(async (id) => {
        const res = await fetch(
          `https://rcon1.82nd.gg/api/get_map_scoreboard?map_id=${id}`,
        );

        const decoded = (await res.json()) as GetMapScoreboardDTO;

        return decoded.result;
      }),
    ),
  );

  React.useEffect(() => {
    const maps = (gameMetadataDTO ?? []).reduce(
      (acc, curr) => [...acc, ...curr],
      [],
    );

    setMapIds(maps.map((m) => m.id));
  }, [gameMetadataDTO]);

  React.useEffect(() => {
    const games = (gameDetails ?? []).filter(
      (game) =>
        new Date(game.end).getTime() >
        Date.now() - periodToEpoch[periodThreshold[0]],
    );
    const steamIdToName: Record<string, string> = {};
    const playerStats = games.map((game) => game.player_stats).flat();

    const aggregatedPlayerStats = playerStats.reduce<
      Record<string, Array<PlayerStats>>
    >((ag, curr) => {
      if (!(curr.steam_id_64 in ag)) {
        ag[curr.steam_id_64] = [];
      }

      if (!(curr.steam_id_64 in steamIdToName)) {
        steamIdToName[curr.steam_id_64] = curr.player;
      }

      ag[curr.steam_id_64].push(curr);

      return ag;
    }, {});

    const filteredPlayerStats = Object.entries(aggregatedPlayerStats).reduce<
      Record<string, Array<PlayerStats>>
    >((fps, [steamId, _games]) => {
      const _filteredGames = _games.filter(
        (game) =>
          game.time_seconds > playtimeThreshold * 60 &&
          game.kills > minKillsThreshold,
      );

      if (_filteredGames.length > numGamesThreshold) {
        fps[steamId] = _filteredGames;
      }
      return fps;
    }, {});

    const _formattedPlayerStats = Object.entries(filteredPlayerStats).reduce<
      Record<
        string,
        {
          games: Array<PlayerStats>;
          summary: {
            numKills: number;
            numDeaths: number;
            playtime: number;
            favouriteWeapons: Record<string, number>;
          };
        }
      >
    >((fps, [steamId, _games]) => {
      fps[steamId] = {
        games: _games,
        summary: {
          numKills: _games.reduce((kills, game) => kills + game.kills, 0),
          numDeaths: _games.reduce((deaths, game) => deaths + game.deaths, 0),
          playtime: _games.reduce(
            (playtime, game) => playtime + game.time_seconds,
            0,
          ),
          favouriteWeapons: _games.reduce<Record<string, number>>(
            (fw, game) => {
              Object.entries(game.weapons).forEach(([weapon, kills]) => {
                if (!(weapon in fw)) {
                  fw[weapon] = 0;
                }

                fw[weapon] += kills;
              });

              return fw;
            },
            {},
          ),
        },
      };

      return fps;
    }, {});

    setFormattedPlayerStats(_formattedPlayerStats);
    setSteamIds(steamIdToName);
  }, [
    gameDetails,
    periodThreshold,
    playtimeThreshold,
    numGamesThreshold,
    profile,
    minKillsThreshold,
  ]);

  React.useEffect(() => {
    setUrls(
      servers.reduce<Array<string>>(
        (acc, server) => [
          ...acc,
          ...[...Array(numPages).keys()].reduce<Array<string>>(
            (acc2, page) => [
              ...acc2,
              `https://rcon${server}.82nd.gg/api/get_scoreboard_maps?page=${
                page + 1
              }`,
            ],
            [],
          ),
        ],
        [],
      ),
    );
  }, [servers, numPages]);

  React.useEffect(
    () =>
      console.log(
        Object.entries(formattedPlayerStats)
          .sort(
            (a, b) =>
              b[1].summary.numKills / b[1].summary.playtime -
              a[1].summary.numKills / a[1].summary.playtime,
          )
          .map(([steamId, stats]) => [
            steamIds[steamId] ?? steamId,
            (60 * stats.summary.numKills) / stats.summary.playtime,
            stats,
          ]),
      ),
    [formattedPlayerStats, steamIds],
  );

  return (
    <>
      <div className={styles.filters}>
        <Input
          initialValue={numGamesThreshold.toString()}
          onChange={(ngt) => ngt && setNumGamesThreshold(parseInt(ngt, 10))}
          placeholder="Min. games"
        />
        <Input
          initialValue={playtimeThreshold.toString()}
          onChange={(ptc) => ptc && setPlaytimeThreshold(parseInt(ptc, 10))}
          placeholder="Min. playtime"
        />
        <Input
          initialValue={minKillsThreshold.toString()}
          onChange={(mkt) => mkt && setMinKillsThreshold(parseInt(mkt, 10))}
          placeholder="Min. kills"
        />
        <Picker
          options={['7d', '1M']}
          onChange={(p) => setPeriodThreshold(p)}
          initialValue={['1M']}
        />
        <Picker
          options={['1', '2', '3']}
          onChange={(s) => setServers(s)}
          initialValue={['1', '2']}
          multiple
        />
        <Picker
          options={['infantry', 'tank', 'all']}
          onChange={(p) => setProfile(p)}
          initialValue={['all']}
        />
      </div>

      {!Object.keys(formattedPlayerStats).length ||
      gameMetadataDTOLoading ||
      gameDetailsLoading ? (
        <LoadingIcon />
      ) : (
        <div className={styles.stats}>
          {Object.entries(formattedPlayerStats)
            .sort(
              (a, b) =>
                b[1].summary.numKills / b[1].summary.playtime -
                a[1].summary.numKills / a[1].summary.playtime,
            )
            .map(([steamId, playerStatistics]) => (
              <div className={styles.row}>
                <span>{steamIds[steamId] ?? steamId}</span>
                <div>
                  <span>{playerStatistics.games.length}</span>
                  <span>
                    {(
                      (60 * playerStatistics.summary.numKills) /
                      playerStatistics.summary.playtime
                    ).toFixed(2)}
                  </span>
                  <span>
                    {getMedian(
                      playerStatistics.games.map(
                        (game) => (60 * game.kills) / game.time_seconds,
                      ),
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
