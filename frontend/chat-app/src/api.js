import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const login = async (username, password) => {
  return await axios.post(`${API_URL}/login`, { username, password });
};
