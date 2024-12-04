import React, { useState } from 'react';
import './ProfileUpdate.css'; // Rutas relativas
import assets from '../../assets/assets'; // Rutas relativas para assets

const ProfileUpdate = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un FormData para manejar la imagen y los datos del formulario
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    if (image) data.append('avatar', image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/profile/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Enviar token en el encabezado
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Perfil actualizado con éxito.');
      } else {
        alert(result.error || 'Error al actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt="Avatar"
            />
            upload profile image
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="bio"
            placeholder="Write profile bio"
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : assets.logo_icon}
          alt="Preview"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
