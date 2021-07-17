import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from{
    opacity: 0;
    transform: translateX(20%);
  }
  to{
    opacity: 1;
    transform: translateX(0%);
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  animation: ${fadeIn} 0.2s;
`;
export const Content = styled.div`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textDark};
  width: 100%;
  padding: 5vh 5vh 10vh 5vh;

  & + & {
    margin-top: 5px;
  }

  @media (max-width: 445px) {
    & {
      padding: 1vh 1vh 5vh 1vh;
    }
  }
`;

export const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
  margin-bottom: 10px;

  thead {
    tr {
      th {
        padding: 10px;
      }
      background: ${props => props.theme.colors.light};
    }
  }

  tbody {
    width: 100%;
    tr {
      border-bottom: 2px solid ${props => props.theme.colors.light};
      text-align: left;
      td {
        padding: 10px;
      }
      th {
        padding: 10px;
      }
    }
    tr:hover {
      background: ${props => props.theme.colors.light};
    }
    tr:hover {
      td {
        form {
          div {
            border-color: ${props => props.theme.colors.background};
          }
        }
      }
    }
  }
`;
