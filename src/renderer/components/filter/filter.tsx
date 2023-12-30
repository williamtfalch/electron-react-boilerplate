/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import React from 'react';
import styles from './styles.module.css';

type OwnProps = {
  onClick: (item: string) => void;
  onChange?: (value: string) => void;
  list: Array<string>;
  name: string;
  className?: string;
};

export function Filter(props: OwnProps) {
  const { onClick, onChange, list, name, className } = props;
  const [filteredList, setFilteredList] = React.useState<Array<string>>([]);
  const [value, setValue] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  function _onClick(_value: string) {
    setValue(_value);
    onClick(_value);
    setIsOpen(false);
  }

  function _onChange(_value: string) {
    setValue(_value);

    if (_value.length) {
      setIsOpen(true);
    }

    if (onChange) {
      onChange(_value);
    }
  }

  React.useEffect(() => {
    setFilteredList(list.filter((item) => item.includes(value)));
  }, [value, list]);

  return (
    <div className={styles.container}>
      <input
        onChange={(e) => _onChange(e.target.value)}
        value={value}
        className={classNames(styles.input, className)}
        placeholder={name}
        onFocus={() => value.length && setIsOpen(true)}
      />

      {isOpen && (
        <div className={styles.list}>
          {filteredList.map((item) => (
            <span className={styles.item} onClick={() => _onClick(item)}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
