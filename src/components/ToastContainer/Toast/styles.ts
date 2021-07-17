import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
  type?: 'info' | 'success' | 'error';
  hasdescription: boolean;
}

const toastVariations = {
  info: css`
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textLight};
  `,
  success: css`
    background-color: ${props => props.theme.success};
    color: ${props => props.theme.colors.background};
  `,
  error: css`
    background-color: ${props => props.theme.error};
    color: ${props => props.theme.colors.background};
  `,
};

export const Container = styled(animated.div)<ToastProps>`
  padding: 2vh;
  width: 50vh;
  position: relative;
  border-radius: 3px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
  display: flex;

  ${props => toastVariations[props.type || 'info']}

  > svg {
    margin: 2px 12px 0 0;
  }

  > div {
    flex: 1;

    p {
      margin-top: 4px;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 8px;
    top: 13px;
    background: transparent;
    border: 0;
    color: inherit;
  }

  @media (max-width: 445px) {
    width: 100%;
  }

  & + & {
    margin-top: 10px;
  }

  ${props =>
    !props.hasdescription &&
    css`
      align-items: center;
      > svg {
        margin-top: 0;
      }
    `}
`;
