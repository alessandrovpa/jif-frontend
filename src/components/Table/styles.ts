import styled from 'styled-components';

export const StyledTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
  margin-top: 10px;

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
      td {
        padding: 10px;
      }
      button {
        border: 2px solid ${props => props.theme.colors.light};
      }
    }
    tr:hover {
      background: ${props => props.theme.colors.light};
      cursor: pointer;
      button {
        border: 2px solid ${props => props.theme.colors.textDark};
      }
    }
  }
`;
