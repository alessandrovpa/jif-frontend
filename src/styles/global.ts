import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    color: ${props => props.theme.colors.textLight};
    background-color: ${props => props.theme.colors.background};
    -webkit-font-smoothing: antialiased;
    font-weight: 300;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  div#root{
    width: 100%;
  }

  body, input, button {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong{
    font-weight: 500;
    text-align: center;
  }

  h1{
    margin: 2vh 0;
  }

  button {
    cursor: pointer;
  }

  @media (max-width: 445px) {
    body, thead, th{
      font-size: 0.7rem;
    }
  }
`;
