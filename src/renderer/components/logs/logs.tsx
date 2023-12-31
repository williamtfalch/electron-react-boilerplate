import { getRecentLogs } from '../../utils';
import { useQuery } from 'react-query';
import { logs } from '../../fixtures/logs';
import { actions } from '../../constants';
import styles from './styles.module.css';
import classNames from 'classnames';
import { Input } from '../input/input';
import { Dropdown } from '../dropdown/dropdown';
import React from 'react';
import { Picker } from '../picker/picker';
import { Filter } from '../filter/filter';

export function Logs() {
  const { data: recentLogs, error } = useQuery('recentLogs', getRecentLogs);
  const [filteredLogs, setFilteredLogs] = React.useState<typeof logs>(logs);
  const [playerFilter, setPlayerFilter] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<Array<string>>([]);
  const [periodFilter, setPeriodFilter] = React.useState<Array<string>>([]);
  console.log(recentLogs);
  React.useEffect(
    () => console.log('s', playerFilter, actionFilter),
    [playerFilter, actionFilter],
  );

  React.useEffect(() => {
    let _filteredLogs = logs;

    if (playerFilter) {
      _filteredLogs = _filteredLogs.filter(
        (log) =>
          (log.player ?? '')
            .toLowerCase()
            .includes(playerFilter.toLowerCase()) ||
          (log.player2 ?? '')
            .toLowerCase()
            .includes(playerFilter.toLowerCase()),
      );
    }

    if (actionFilter.length) {
      console.log(actionFilter, _filteredLogs);
      _filteredLogs = _filteredLogs.filter((log) =>
        actionFilter.includes(log.action),
      );
      console.log(_filteredLogs);
    }

    if (actionFilter.length) {
      console.log(actionFilter, _filteredLogs);
      _filteredLogs = _filteredLogs.filter((log) =>
        actionFilter.includes(log.action),
      );
      console.log(_filteredLogs);
    }

    if (periodFilter.length) {
      const period = periodFilter[0] ?? 'AT';
      const periodToEpoch: Record<string, number> = {
        '3h': 10800000,
        '1d': 86400000,
        '7d': 604800000,
        '30d': 2592000000,
        AT: 10000000000000,
      };
      const periodEpoch = periodToEpoch[period];
      const currentEpoch = Date.now();

      _filteredLogs = _filteredLogs.filter(
        (log) => log.timestamp_ms > currentEpoch - periodEpoch,
      );
    }

    setFilteredLogs(_filteredLogs);
  }, [logs, playerFilter, actionFilter, periodFilter, setFilteredLogs]);

  return (
    <>
      <div className={styles.filters}>
        <Input onChange={(p) => setPlayerFilter(p)} placeholder="player" />
        <Dropdown
          name="actions"
          options={actions}
          onChange={(a) => setActionFilter(a)}
          multiple
        />
        <Picker
          options={['3h', '1d', '7d', '30d', 'AT']}
          onChange={(p) => setPeriodFilter(p)}
        />
        <Filter
          onChange={(val) => console.log(val)}
          list={['asdsad', 'basdsad', 'asdsadasdc']}
          name="player"
        />
      </div>
      <div className={styles.logs}>
        <div className={classNames(styles.line, styles.header)}>
          <span className={styles.item}>Timestamp</span>
          <span className={styles.item}>Action</span>
          <span className={styles.item}>Player 1</span>
          <span className={styles.item}>Player 2</span>
        </div>
        {filteredLogs.map((log) => (
          <div className={styles.line}>
            <span className={styles.item}>
              {new Date(log.timestamp_ms).toUTCString()}
            </span>
            <span className={classNames(styles.item, styles.action)}>
              {log.action}
            </span>
            <span>{log.player}</span>
            {log.player2 && <span>{log.player2}</span>}
          </div>
        ))}
      </div>
    </>
  );
}
