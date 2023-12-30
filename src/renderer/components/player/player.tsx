/* eslint-disable import/prefer-default-export */
import { useQuery } from 'react-query';
import { Outlet, Link } from 'react-router-dom';
import classNames from 'classnames';
import React from 'react';
import { fetcher, getPlayers, multiFetcher } from '../../utils';
import styles from './styles.module.css';
import { Input } from '../input/input';
import { Dropdown } from '../dropdown/dropdown';
import { Picker } from '../picker/picker';
import { Filter } from '../filter/filter';
import useSWR from 'swr';
import type {
  PlayersHistory,
  Player as PlayerInfo,
} from '../../types/players_history';
import {
  GameMetadata,
  GetScoreboardMaps,
  GetScoreboardMapsDTO,
} from '../../types/get_scoreboard_maps';

export function Player() {
  const [playerFilter, setPlayerFilter] = React.useState('');
  const [players, setPlayers] = React.useState<Array<PlayerInfo>>([]);
  const [player, setPlayer] = React.useState<PlayerInfo | undefined>(undefined);
  const [gameMetadata, setGameMetadata] = React.useState<Array<GameMetadata>>(
    [],
  );
  const [gameIds, setGameIds] = React.useState<Array<number>>([]);

  // const { data, status, isFetching, error } = useQuery({
  //   queryKey: ['getPlayers', playerFilter],
  //   queryFn: () => getPlayers(playerFilter),
  // });
  const {
    data: playersDTO,
    error: playersDTOError,
    isLoading: playersDTOLoading,
  } = useSWR<PlayersHistory>(
    `https://rcon1.82nd.gg/api/players_history?player_name=${playerFilter}&page_size=10`,
    fetcher,
  );

  // const {
  //   data: gameMetadata,
  //   error: gameMetadataError,
  //   isLoading: gameMetadataLoading,
  // } = useSWR<Array<GetScoreboardMaps>>(
  //   [
  //     'https://rcon1.82nd.gg/api/get_scoreboard_maps',
  //     'https://rcon2.82nd.gg/api/get_scoreboard_maps',
  //   ],
  //   multiFetcher,
  // );

  const {
    data: gameMetadataDTO,
    error: gameMetadataDTOError,
    isLoading: gameMetadataDTOLoading,
  } = useSWR(
    [
      'https://rcon1.82nd.gg/api/get_scoreboard_maps?page=1',
      // 'https://rcon1.82nd.gg/api/get_scoreboard_maps?page=2',
      // 'https://rcon1.82nd.gg/api/get_scoreboard_maps?page=3',
      // 'https://rcon.82nd.gg/api/get_scoreboard_maps?page=1',
      // 'https://rcon2.82nd.gg/api/get_scoreboard_maps?page=2',
      // 'https://rcon2.82nd.gg/api/get_scoreboard_maps?page=3',
    ],
    async (urls) =>
      Promise.all(
        urls.map((url) =>
          fetch(url).then(async (response) => {
            const res = (await response.json()) as GetScoreboardMapsDTO;

            return res.result.maps;
          }),
        ),
      ),
  );

  const {
    data: gameDetailsDTO,
    error: gameDetailsDTOError,
    isLoading: gameDetailsDTOLoading,
  } = useSWR(gameIds, async (ids) =>
    Promise.all(
      ids.map((id) =>
        fetch(`https://rcon1.82nd.gg/api/get_map_scoreboard?map_id=${id}`).then(
          async (response) => {
            const res = (await response.json()) as GetScoreboardMapsDTO;

            return res.result;
          },
        ),
      ),
    ),
  );

  React.useEffect(() => {
    if (playersDTO?.players.length) {
      setPlayers(playersDTO.players);
    }
  }, [playersDTO]);

  React.useEffect(() => {
    const maps =
      gameMetadataDTO?.reduce((acc, curr) => [...acc, ...curr], []) ?? [];

    const ids = maps.map((m) => m.id);

    setGameMetadata(maps);
    setGameIds(ids);
  }, [gameMetadataDTO]);

  React.useEffect(() => console.log(gameDetailsDTO), [gameDetailsDTO]);

  return (
    <>
      <div className={styles.filters}>
        <Filter
          name="player"
          list={players.map((p) => p.names[0].name)}
          onChange={(f) => setPlayerFilter(f)}
          onClick={(p) =>
            setPlayer(players.find((pl) => pl.names[0].name === p))
          }
        />
      </div>

      <div className={styles.spacer} />

      <Link to="id" className={styles.item}>
        Test
      </Link>

      <Outlet />
    </>
  );
}
