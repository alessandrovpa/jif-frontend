import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.light};
  border: 2px solid ${props => props.theme.colors.light};
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  color: ${props => props.theme.colors.textDark};

  transition: 0.2s;
  &:focus-within {
    border-color: ${props => props.theme.colors.textDark};
    transition: 0.2s;
    color: ${props => props.theme.colors.textDark};
    svg {
      opacity: 1;
    }
  }
  & + & {
    margin-top: 5px;
  }

  label {
    width: 100%;
    margin-left: 5px;
    cursor: pointer;
  }

  input {
    color: ${props => props.theme.colors.textDark};
    flex: 1;
    background: none;
    border: 0;
    &::placeholder {
      color: ${props => props.theme.colors.background};
      opacity: 0.5;
    }
  }
  svg {
    margin-right: 10px;
    opacity: 0.4;
  }
`;
