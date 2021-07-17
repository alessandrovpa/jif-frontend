import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
`;

export const Nav = styled.nav`
  height: 100vh;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textDark};
`;

export const Page = styled.div`
  flex: 1;
  padding: 10px;
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
`;
export const Teste = styled.div``;
