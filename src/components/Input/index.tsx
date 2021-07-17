import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';
import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  label?: string;
  type: string;
}

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  label,
  type,
  children,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [registerField, fieldName]);

  const veirfyFilled = useCallback(() => {
    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container isErrored={!!error} isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        defaultValue={defaultValue}
        ref={inputRef}
        onBlur={veirfyFilled}
        {...rest}
        type={type}
        name={name}
      />
      {children}
      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
