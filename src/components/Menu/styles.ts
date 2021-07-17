import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { animated } from 'react-spring';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  ul {
    display: flex;
    flex-direction: column;

    li {
      padding: 10px;
    }
  }
  > svg {
    margin: 5px;
  }
  > svg:hover {
    cursor: pointer;
  }
`;

interface AnchorProps {
  isActived?: boolean;
}

export const Anchor = styled(Link)<AnchorProps>`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  text-decoration: none;
  padding: 0.7vh;

  color: ${props => props.theme.colors.textDark};
  &:hover {
    cursor: pointer;
    background: ${props => props.theme.colors.light};
  }

  li {
    list-style: none;
    flex: 1;
  }

  ${props =>
    props.isActived &&
    css`
      background: ${props.theme.colors.light};
    `}

  &+& {
    margin-top: 2px;
  }
`;

export const Ul = styled(animated.ul)`
  width: 30vh;
`;
