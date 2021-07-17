import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  position: relative;
  color: ${props => props.theme.error};
  cursor: pointer;
  span {
    width: 160px;
    position: absolute;
    background: ${props => props.theme.colors.dark};
    color: ${props => props.theme.colors.background};
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;

    &::before {
      content: '';
      border-style: solid;
      border-color: ${props => props.theme.colors.dark} transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
