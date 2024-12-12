
import axios from 'axios';

// Crear una instancia personalizada de Axios
const api = axios.create({
  baseURL: 'http://localhost:3001', // Configuración de la base URL
  headers: {
    'Content-Type': 'application/json', // Asegúrate de enviar datos como JSON
  },
});

export default api;
