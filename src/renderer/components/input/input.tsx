/* eslint-disable react/require-default-props */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.css';

type OwnProps = {
  onChange: (option: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
};

export function Input(props: OwnProps) {
  const { onChange, placeholder, className, initialValue } = props;
  const [value, setValue] = React.useState(initialValue ?? '');

  return (
    <input
      placeholder={placeholder}
      onChange={(e) => {
        const val = e.target.value;
        setValue(val);
        onChange(val);
      }}
      className={classNames(styles.input, className)}
      value={value}
    />
  );
}
