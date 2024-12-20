import React, { useState } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import api from '../../api'

const Login = () => {
  const [currState, setCurrState] = useState('Sign up');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Validación básica
    if (!formData.username || !formData.password || (currState === 'Sign up' && !formData.email)) {
       alert('Todos los campos son obligatorios');
       return;
  }
 
    const endpoint = currState === 'Sign up' ? '/api/Users/register' : '/api/Users/login';
    console.log("Datos enviados desde el formulario:", formData);

    try {
   
      const response = await api.post(endpoint,formData); //Usamos api.js para hacer la solicitud 

    if (response.status === 200 || response.status === 201) {
        const data = response.data;
        if (currState === 'Login') {
           localStorage.setItem('token', data.token);
           alert('Inicio de sesión exitoso');
           navigate('/../Chat');
        } else {
           alert('Registro exitoso. Ahora puedes iniciar sesión');
           setCurrState('Login');
        }
    } else {
        alert(response.data.error || 'Ocurrió un error inesperado');
    }

    } catch(error){
      console.error('Error al enviar el formulario: ', error); 
      alert('Error al conectar con el servidor'); 
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="Logo" className="logo" />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currState}</h2>
        {currState === 'Sign up' && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-input"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {currState === 'Sign up' ? 'Create account' : 'Login now'}
        </button>
        {currState === 'Sign up' && (
          <div className="login-term">
            <input type="checkbox" required />
            <p>Agree to the terms of use & privacy policy</p>
          </div>
        )}
        <div className="login-forgot">
          {currState === 'Sign up' ? (
            <p className="login-toggle">
              Already have an account?{' '}
              <span onClick={() => setCurrState('Login')}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account?{' '}
              <span onClick={() => setCurrState('Sign up')}>Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
