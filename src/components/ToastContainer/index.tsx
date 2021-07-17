import React from 'react';
import { useTransition } from 'react-spring';

import { Container } from './styles';
import { ToastMessage } from '../../context/ToastContext';
import Toast from './Toast';

interface ToastProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastProps> = ({ messages }) => {
  const messagesTransitions = useTransition(messages, message => message.id, {
    from: {
      right: '-90%',
      opacity: '0',
    },
    enter: {
      right: '0%',
      opacity: '1',
    },
    leave: {
      right: '-120%',
      opacity: '0',
    },
  });

  return (
    <Container>
      {messagesTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  );
};

export default ToastContainer;
