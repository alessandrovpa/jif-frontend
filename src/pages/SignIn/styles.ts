import styled, { keyframes } from 'styled-components';
import background from '../../assets/background.jpg';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${background}) no-repeat center;
  background-size: cover;
`;

const appear = keyframes`
  from{
    opacity: 0;
    transform: scale(0.5);
  }
  to{
    opacity: 1;
    transform: scale(1);
  }
`;

export const Content = styled.div`
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  place-content: center;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  box-shadow: 0px 0px 20px black;
  border-radius: 5px;

  animation: ${appear} 0.5s;

  transition: 0.3s;
  :hover {
    box-shadow: 0px 0px 20px white;
    transition: 0.3s;
  }

  form {
    height: 100%;
    padding: 5vh;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
    }
  }
`;
