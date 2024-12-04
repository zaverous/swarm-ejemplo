const mongoose = require('mongoose');

// Configuración de la conexión a MongoDB
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp'; // Usar variable de entorno si está definida

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Terminar proceso si la conexión falla
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
