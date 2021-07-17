import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: ${props => props.theme.colors.light};
  border: 0;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  color: ${props => props.theme.colors.textDark};
  div + & {
    margin-top: 12px;
  }
  & + & {
    margin-top: 12px;
  }

  transition: 0.2s;
  &:hover {
    background-color: ${props => shade(0.4, props.theme.colors.light)};
    transition: 0.2s;
  }
`;
