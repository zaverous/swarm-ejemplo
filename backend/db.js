const mongoose = require('mongoose');

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/chatApp'); // Cambia el nombre de la base de datos si es necesario
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Termina el proceso si la conexión falla
  }
}

// Obtener todas las colecciones y sus documentos
async function getFullDatabase() {
  try {
    const db = mongoose.connection.db; // Acceso a la base de datos
    const collections = await db.listCollections().toArray(); // Listar colecciones

    const data = {}; // Almacenar resultados
    for (const collection of collections) {
      const collectionName = collection.name;
      const docs = await db.collection(collectionName).find().toArray(); // Obtener documentos
      data[collectionName] = docs; // Guardar documentos en el objeto
    }

    return data; // Devolver toda la base de datos
  } catch (error) {
    console.error('Error al obtener la base de datos:', error);
    throw error; // Lanzar error para manejarlo en server.js
  }
}

module.exports = { connectDB, getFullDatabase, mongoose };

