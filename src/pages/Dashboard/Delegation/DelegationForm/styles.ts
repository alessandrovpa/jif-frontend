import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const Content = styled.div`
  width: 100%;
  div#title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${props => props.theme.colors.textDark};
    h1 {
      flex: 1;
    }

    button {
      color: ${props => props.theme.colors.textDark};
      background: none;
      border: 0;
    }
  }

  figure {
    padding: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;
  }
  img {
    height: 100%;
    width: 100%;
  }
`;
