import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  SelectHTMLAttributes,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';
import { Container, Error, Option } from './styles';

export interface OptionsProps {
  name: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  options: Array<OptionsProps>;
  id?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  icon: Icon,
  options,
  id,
  ...rest
}) => {
  const inputRef = useRef<HTMLSelectElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [isFilled, setIsFilled] = useState(false);
  const [inputOptions, setOptions] = useState<OptionsProps[]>([]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
    setOptions(options);
  }, [registerField, fieldName, options]);

  const veirfyFilled = useCallback(() => {
    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container isErrored={!!error} isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      <select
        id={id}
        defaultValue={defaultValue}
        ref={inputRef}
        onBlur={veirfyFilled}
        {...rest}
      >
        {inputOptions &&
          inputOptions.map(opt => (
            <Option value={opt.value} key={opt.value}>
              {opt.name}
            </Option>
          ))}
      </select>
      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
