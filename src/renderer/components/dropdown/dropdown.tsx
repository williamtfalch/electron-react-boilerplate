/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import React from 'react';
import styles from './styles.module.css';

type OwnProps = {
  name: string;
  options: Array<string>;
  onChange: (options: Array<string>) => void;
  className?: string;
  multiple?: boolean;
};

export function Dropdown(props: OwnProps) {
  const { options, onChange, name, className, multiple } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<Array<string>>(
    [],
  );

  React.useEffect(() => {
    onChange(selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  function toggleOption(option: string) {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }

    if (!multiple) {
      setIsOpen(false);
    }
  }

  return (
    <div className={classNames(styles.container, className)}>
      <span className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        {selectedOptions.length ? selectedOptions.join(', ') : name}
      </span>
      <div
        className={classNames(styles.options, {
          [styles.open]: isOpen,
        })}
      >
        {options.map((option) => (
          <span
            className={classNames(styles.item, {
              [styles.selected]: selectedOptions.includes(option),
            })}
            onClick={() => toggleOption(option)}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}
