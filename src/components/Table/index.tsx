import React from 'react';

import { StyledTable } from './styles';

const Table: React.FC = ({ children }) => {
  return <StyledTable>{children}</StyledTable>;
};

export default Table;
