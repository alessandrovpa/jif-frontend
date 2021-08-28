import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textDark};
  height: 7vh;
  width: 100%;
  padding-left: 5px;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  svg:hover {
    cursor: pointer;
    height: 100%;
  }

  button {
    height: 100%;
    padding: 5px;
    color: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: 0;
  }
  button:hover {
    cursor: pointer;
    background: ${props => props.theme.colors.light};
  }

  @media (max-width: 445px) {
    #logo {
      display: none;
    }
    svg {
      font-size: 0.8rem;
    }
  }
`;
