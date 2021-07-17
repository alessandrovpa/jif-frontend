import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.light};
  border: 2px solid ${props => props.theme.colors.light};
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  color: ${props => props.theme.colors.textDark};
  margin-top: 5px;

  transition: 0.2s;
  &:focus-within {
    border-color: ${props => props.theme.colors.textDark};
    transition: 0.2s;
    color: ${props => props.theme.colors.textDark};
    svg {
      opacity: 1;
    }
  }
  select {
    color: ${props => props.theme.colors.textDark};
    flex: 1;
    background: none;
    height: 100%;
    border: 0;
    &::placeholder {
      color: ${props => props.theme.colors.background};
      opacity: 0.5;
    }
    &:hover {
      cursor: pointer;
    }
  }

  svg {
    margin-right: 10px;
    opacity: 0.4;
    ${props =>
      props.isFilled &&
      css`
        color: ${props.theme.colors.background};
        opacity: 1;
      `}
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: ${props.theme.error};
      color: ${props.theme.error};
      svg {
        opacity: 1;
      }
    `}
  &:hover {
    cursor: pointer;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  svg {
    margin: 0;
  }
  span {
    background: ${props => props.theme.error};
    &::before {
      border-color: ${props => props.theme.error} transparent;
    }
  }
`;

export const Option = styled.option`
  background: ${props => props.theme.colors.primary};
  font-size: 20px;
  padding: 10px;

  &:hover {
    background: ${props => props.theme.colors.light};
  }
`;
