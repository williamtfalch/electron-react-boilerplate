/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import useSWR from 'swr';
import classNames from 'classnames';
import React from 'react';
import { periodToEpoch } from '../../constants';
import styles from './styles.module.css';
import { Input } from '../input/input';
import { Picker } from '../picker/picker';
import {
  GetHistoricalLogsDTO,
  HistoricalLog,
  HistoricalLogs,
} from '../../types/get_historical_logs';

import { getTimestamp } from '../../utils';
import { LoadingIcon } from '../loadingIcon/loadingIcon';
import { Gamestate, GetGamestateDTO } from '../../types/get_gamestate';

const servers = ['1', '2'];
const actions = ['CONNECTED', 'DISCONNECTED'];
const numDays = 1;

const urls: Array<string> = servers.reduce<Array<string>>(
  (acc, server) => [
    ...acc,
    ...actions.reduce<Array<string>>(
      (acc2, action) => [
        ...acc2,
        ...[...Array(numDays).keys()].reduce<Array<string>>(
          (acc3, day) => [
            ...acc3,
            `https://rcon1.82nd.gg/api/get_historical_logs?server_filter=${server}&limit=10000&log_type=${action}&till=${new Date(
              Date.now() - 86400000 * day,
            ).toISOString()}&from=${new Date(
              Date.now() - 86400000 * (day + 1),
            ).toISOString()}`,
          ],
          [],
        ),
      ],
      [],
    ),
  ],
  [],
);

export function Seeding() {
  const [periodFilter, setPeriodFilter] = React.useState<Array<string>>(['3M']);
  const [player, setPlayer] = React.useState('');
  const [serverFilter, setServerFilter] = React.useState<Array<string>>([
    '1',
    '2',
  ]);
  const [logs, setLogs] = React.useState<{
    s1: HistoricalLogs;
    s2: HistoricalLogs;
  }>({ s1: [], s2: [] });

  const {
    data: historicalLogsDTO,
    error: historicalLogsDTOError,
    isLoading: historicalLogsDTOLoading,
  } = useSWR<Array<HistoricalLogs>>(urls, async () =>
    Promise.all(
      urls.map(async (url) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer c9e06262-608c-48b5-b781-c6ebb3280325`,
            'Access-Control-Allow-Origin': '*',
          },
        });

        const decoded = (await res.json()) as GetHistoricalLogsDTO;

        return decoded.result;
      }),
    ),
  );

  const {
    data: serverStatusDTO,
    error: serverStatusDTOError,
    isLoading: serverStatusDTOLoading,
  } = useSWR<Array<Gamestate>>(urls, async () =>
    Promise.all(
      [
        `https://rcon1.82nd.gg/api/get_gamestate?server=1`,
        `https://rcon1.82nd.gg/api/get_gamestate?server=2`,
      ].map(async (url) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer c9e06262-608c-48b5-b781-c6ebb3280325`,
            'Access-Control-Allow-Origin': '*',
          },
        });

        const decoded = (await res.json()) as GetGamestateDTO;

        return decoded.result;
      }),
    ),
  );

  React.useEffect(() => {
    if (!historicalLogsDTO) {
      return;
    }

    const flattenedLogs = historicalLogsDTO.flat();

    const s1Logs = flattenedLogs.filter((l) => l.server === '1');
    const sortedS1Logs = s1Logs.sort((a, b) => b.event_time - a.event_time);

    const s2Logs = flattenedLogs.filter((l) => l.server === '2');
    const sortedS2Logs = s2Logs.sort((a, b) => b.event_time - a.event_time);

    setLogs({
      s1: sortedS1Logs,
      s2: sortedS2Logs,
    });
  }, [historicalLogsDTO]);

  if (historicalLogsDTOError) {
    return <div>failed to load</div>;
  }

  return (
    <>
      <div className={styles.filters}>
        <Input onChange={(p) => setPlayer(p)} placeholder="Player" />

        <Picker
          options={['7d', '1M', '3M']}
          onChange={(p) => setPeriodFilter(p)}
          initialValue={periodFilter}
        />

        <Picker
          options={['1', '2']}
          onChange={(s) => setServerFilter(s)}
          initialValue={serverFilter}
          multiple
        />
      </div>

      {historicalLogsDTOLoading && !Object.entries(groupedLogs).length ? (
        <LoadingIcon />
      ) : (
        <div className={styles.logs}>
          {Object.entries(groupedLogs)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([steamId, _logs]) => {
              return (
                <>
                  <div className={classNames(styles.row, styles.header)}>
                    <img
                      src={copy}
                      alt=""
                      className={styles.copy}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${_logs[0].player_name} - ${steamId}\n${_logs.reduce(
                            (acc, l) => {
                              const timestamp = getTimestamp(
                                1000 * l.event_time,
                              );

                              return `${acc}\n${timestamp} - ${l.content}`;
                            },
                            '',
                          )}`,
                        );
                      }}
                    />
                    <span>{_logs[0].player_name}</span>
                    <span>{_logs.length}</span>
                  </div>

                  {_logs.map((log) => (
                    <div className={styles.row}>
                      <span>{getTimestamp(1000 * log.event_time)}</span>
                      <span>{log.player2_name}</span>
                      <span>{log.server}</span>
                      <span>{log.weapon}</span>
                    </div>
                  ))}
                </>
              );
            })}
        </div>
      )}
    </>
  );
}
