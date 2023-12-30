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
  HistoricalLog,
  HistoricalLogs as HistoricalLogsType,
} from '../../types/get_historical_logs';

import copy from '../../static/copy.svg';
import { getTimestamp } from '../../utils';
import { LoadingIcon } from '../loadingIcon/loadingIcon';
import Store from 'electron-store';

const excludedWeapons = [
  'S-MINE',
  'PANZERSCHRECK',
  '75MM CANNON [Sherman M4A3(75)W]',
  'HULL M1919 [Sherman M4A3(75)W]',
  'M6 37mm [M8 Greyhound]',
  'M43 STIELHANDGRANATE',
  'SATCHEL',
  'COAXIAL MG34 [Sd.Kfz.234 Puma]',
  'MK2 GRENADE',
  '76MM M1 GUN [Sherman M4A3E2(76)]',
  'COAXIAL M1919 [Sherman M4A3E2(76)]',
  '150MM HOWITZER [sFH 18]',
  'BAZOOKA',
  'COAXIAL MG34 [Sd.Kfz.181 Tiger 1]',
  'Sd.Kfz.121 Luchs',
  'M2 AP MINE',
  '88 KWK 36 L/56 [Sd.Kfz.181 Tiger 1]',
  'HULL MG34 [Sd.Kfz.181 Tiger 1]',
  'HULL MG34 [Sd.Kfz.171 Panther]',
  'COAXIAL MG34 [Sd.Kfz.121 Luchs]',
  '75MM CANNON [Sd.Kfz.171 Panther]',
  '20MM KWK 30 [Sd.Kfz.121 Luchs]',
  'Sd.Kfz.181 Tiger 1',
  '155MM HOWITZER [M114]',
  'BOMBING RUN',
  'COAXIAL MG34 [Sd.Kfz.171 Panther]',
  '50mm KwK 39/1 [Sd.Kfz.234 Puma]',
  'Sd.Kfz.234 Puma',
  'Opel Blitz (Transport)',
  'Sd.Kfz.171 Panther',
  'TELLERMINE 43',
  'COAXIAL M1919 [Sherman M4A3(75)W]',
  'COAXIAL MG34',
  '75MM CANNON [Sd.Kfz.161 Panzer IV]',
  'COAXIAL MG34 [Sd.Kfz.161 Panzer IV]',
  'COAXIAL M1919 [M8 Greyhound]',
  'COAXIAL M1919 [Stuart M5A1]',
  'M8 Greyhound',
  'M1A1 AT MINE',
  '37MM CANNON [Stuart M5A1]',
  'HULL M1919 [Sherman M4A3E2(76)]',
  'GMC CCKW 353 (Supply)',
  'STRAFING RUN',
  'HULL MG34 [Sd.Kfz.161 Panzer IV]',
  'PRECISION STRIKE',
  'HULL M1919 [Stuart M5A1]',
  'Opel Blitz (Supply)',
  'GMC CCKW 353 (Transport)',
  'MG 42 [Sd.Kfz 251 Half-track]',
  'HULL M1919',
  'Kubelwagen',
  'Mills Bomb',
  'OQF 6 - POUNDER Mk.V [Churchill Mk.III]',
  'HULL BESA 7.92mm [Churchill Mk.III]',
  'COAXIAL BESA 7.92mm [Churchill Mk.III]',
  'QF 25-POUNDER [QF 25-Pounder]',
  '75MM CANNON [PAK 40]',
  'PIAT',
  'Satchel',
  'M24 STIELHANDGRANATE',
  'COAXIAL BESA [Daimler]',
  'Bedford OYD (Transport)',
  'Bedford OYD (Supply)',
  'COAXIAL M1919 [Firefly]',
  'QF 17-POUNDER [Firefly]',
  'COAXIAL BESA [Cromwell]',
  'QF 75MM [Cromwell]',
  'A.P. Shrapnel Mine Mk II',
  'QF 2-POUNDER [Daimler]',
  'Cromwell',
  'PPSH 41 W/DRUM',
  'ZIS-5 (Supply)',
  'RG-42 GRENADE',
  '19-K 45MM [BA-10]',
  'POMZ AP MINE',
  '122MM HOWITZER [M1938 (M-30)]',
  'MOLOTOV',
  'ZIS-5 (Transport)',
  'Sd.Kfz.161 Panzer IV',
  'IS-1',
  '45MM M1937 [T70]',
  'SATCHEL CHARGE',
  'Sherman M4A3E2(76)',
  '75MM M3 GUN [Sherman M4A3E2]',
  'BA-10',
  'D-5T 85MM [IS-1]',
  '76MM ZiS-5 [T34/76]',
  'QF 2-POUNDER [Tetrarch]',
  'T34/76',
];

type Log = HistoricalLog & {
  steam_64_id: string;
};

export function HistoricalLogs() {
  const [periodFilter, setPeriodFilter] = React.useState<Array<string>>([]);
  const [player, setPlayer] = React.useState('');
  const [numTKThreshold, setNumTKThreshold] = React.useState(3);
  const [filteredLogs, setFilteredLogs] = React.useState<Array<Log>>([]);
  const [groupedLogs, setGroupedLogs] = React.useState<
    Record<string, Array<Log>>
  >({});
  const [serverFilter, setServerFilter] = React.useState<Array<string>>([
    '1',
    '2',
  ]);
  const [till, setTill] = React.useState(new Date().toISOString());

  const {
    data: historicalLogsDTO,
    error: historicalLogsDTOError,
    isLoading: historicalLogsDTOLoading,
  } = useSWR<HistoricalLogsType>(
    `https://rcon1.82nd.gg/api/get_historical_logs?limit=10000&log_type=TEAM KILL&till=${till}`,
    async (url: string) => {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer c9e06262-608c-48b5-b781-c6ebb3280325`,
        },
      });

      const decoded = await res.json();

      return decoded.result;
    },
  );

  React.useEffect(() => {
    if (!historicalLogsDTO) {
      return;
    }

    const periodEpoch = periodToEpoch[periodFilter[0]];
    const _filteredLogs =
      historicalLogsDTO?.filter(
        (log) =>
          new Date(log.creation_time).getTime() >=
            new Date().getTime() - periodEpoch &&
          !excludedWeapons.includes(log.weapon) &&
          (!player ||
            log.player_name.toLowerCase().includes(player.toLowerCase())) &&
          (!serverFilter.length || serverFilter.includes(log.server)),
      ) ?? [];

    const mappedLogs = _filteredLogs.map((log) => {
      const regex = /(\d{17})/;
      const match = log.content.match(regex);
      const steam_64_id = match ? match[1] : '';

      return {
        ...log,
        steam_64_id,
      };
    });

    setFilteredLogs(mappedLogs);
  }, [historicalLogsDTO, periodFilter, player, serverFilter]);

  React.useEffect(() => {
    let _groupedLogs = filteredLogs.reduce(
      (acc, curr) => {
        const { steam_64_id } = curr;

        if (acc[steam_64_id]) {
          acc[steam_64_id].push(curr);
        } else {
          acc[steam_64_id] = [curr];
        }

        return acc;
      },
      {} as Record<string, Array<Log>>,
    );

    _groupedLogs = Object.fromEntries(
      Object.entries(_groupedLogs).filter(
        ([, _logs]) => _logs.length >= numTKThreshold,
      ),
    );

    setGroupedLogs(_groupedLogs);
  }, [filteredLogs, numTKThreshold]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTill(new Date().toISOString());
    }, 30000);

    return () => clearInterval(interval);
  }, [till]);

  React.useEffect(() => {
    //const store = new Store();
    // const val = store.get('test');
    // console.log('test', val);
    // store.set('test', Math.random());
  }, []);

  if (historicalLogsDTOError) {
    return <div>failed to load</div>;
  }

  return (
    <>
      <div className={styles.filters}>
        <Input onChange={(p) => setPlayer(p)} placeholder="Player" />

        <Input
          initialValue={numTKThreshold.toString()}
          onChange={(ntkt) => setNumTKThreshold(parseInt(ntkt, 10))}
          placeholder="Num. tk thresh"
        />

        <Picker
          options={['1h', '3h', '6h', '12h', '1d', '3d', '7d']}
          onChange={(p) => setPeriodFilter(p)}
          initialValue={['1d']}
        />

        <Picker
          options={['1', '2', '3']}
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
