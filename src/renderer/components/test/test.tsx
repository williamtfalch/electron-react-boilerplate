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
import { Template } from '../layout/layout';

export function Test() {
  return <h1>TEST</h1>;
}
