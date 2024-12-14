
import axios from 'axios';

// Crear una instancia personalizada de Axios
const api = axios.create({
  baseURL: '/api', // Modificar
  headers: {
    'Content-Type': 'application/json', // Asegúrate de enviar datos como JSON
  },
});

export default api;
