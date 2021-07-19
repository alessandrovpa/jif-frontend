import React from 'react';
import { IconBaseProps } from 'react-icons';
import { AiFillHome } from 'react-icons/ai';
import { FaTasks } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import { HiUsers } from 'react-icons/hi';

interface InterfaceMenuData {
  title: string;
  path: string;
  icon: IconBaseProps;
  required?: number;
}

export const MenuData: Array<InterfaceMenuData> = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <AiFillHome />,
  },
  {
    title: 'Atletas',
    path: '/dashboard/athlete',
    icon: <RiTeamFill />,
    required: 3,
  },
  {
    title: 'Delegações',
    path: '/dashboard/delegation',
    icon: <RiTeamFill />,
    required: 1,
  },
  {
    title: 'Modalidades',
    path: '/dashboard/modality',
    icon: <FaTasks />,
    required: 1,
  },
  {
    title: 'Servidores',
    path: '/dashboard/user',
    icon: <HiUsers />,
    required: 2,
  },
  {
    title: 'Funções',
    path: '/dashboard/function',
    icon: <HiUsers />,
    required: 1,
  },
  {
    title: 'Primeiro acesso',
    path: '/firstlogin',
    icon: <HiUsers />,
  },
];
