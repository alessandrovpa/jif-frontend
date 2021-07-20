import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jifnacional.ifgoiano.edu.br:3333',
});

export default api;
