/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import React from 'react';
import styles from './styles.module.css';

type OwnProps = {
  options: Array<string>;
  onChange: (selected: Array<string>) => void;
  initialValue?: Array<string>;
  multiple?: boolean;
};

export function Picker(props: OwnProps) {
  const { options, onChange, initialValue, multiple } = props;
  const [selected, setSelected] = React.useState<Array<string>>(
    initialValue ?? [],
  );

  function _onClick(option: string) {
    if (!multiple) {
      if (selected.includes(option)) {
        setSelected([]);
      } else {
        setSelected([option]);
      }

      return;
    }

    const _selected = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];

    setSelected(_selected);
  }

  React.useEffect(() => onChange(selected), [selected]);

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <span
          className={classNames(styles.option, {
            [styles.selected]: selected.includes(option),
          })}
          onClick={() => _onClick(option)}
        >
          {option}
        </span>
      ))}
    </div>
  );
}
