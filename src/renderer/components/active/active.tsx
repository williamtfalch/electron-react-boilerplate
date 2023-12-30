import { getRecentLogs } from '../../utils';
import { useQuery } from 'react-query';
import { Outlet } from 'react-router-dom';
import { logs } from '../../fixtures/logs';
import { actions } from '../../constants';
import styles from './styles.module.css';
import classNames from 'classnames';
import { Input } from '../input/input';
import { Dropdown } from '../dropdown/dropdown';
import React from 'react';
import { Picker } from '../picker/picker';
import { Template } from '../layout/layout';
import { Link } from 'react-router-dom';

export function Active() {
  const { data: recentLogs, error } = useQuery('recentLogs', getRecentLogs);
  const [filteredLogs, setFilteredLogs] = React.useState<typeof logs>(logs);
  const [playerFilter, setPlayerFilter] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<Array<string>>([]);
  const [periodFilter, setPeriodFilter] = React.useState<Array<string>>([]);

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
          options={['3h', '1d', '7d', '1M', 'AT']}
          onChange={(p) => setPeriodFilter(p)}
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
