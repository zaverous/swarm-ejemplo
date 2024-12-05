/*const mongoose = require('mongoose');
require('dotenv').config();

// Configuración de la conexión a MongoDB
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp'; // Usar variable de entorno si está definida

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Conectado a MongoDB con exito');
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

module.exports = { connectDB, getFullDatabase, mongoose };*/

const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp';

/*
async function connectDB() {

  if (!DB_URI) {
    console.error('MONGODB_URI no está configurada');
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI);
    console.log('Conectado a MongoDB con éxito');

    //nuevo
    if (mongoose.connection.readyState !== 1){
      console.error( 'Conexión a la base de datos NO DISPONIBLE');
    }else{

      console.error( 'Conexión a la base de datos DISPONIBLE');
    }
    mongoose.connection.once('open', () => {
      console.log('Conexión establecida.');
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}*/

async function connectDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Conectado a MongoDB con éxito');
    
    mongoose.connection.on('connected', () => {
      console.log('Conexión a MongoDB establecida');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Error en la conexión a MongoDB:', err);
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

//module.exports = { connectDB, mongoose };

async function getFullDatabase() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('No conectado a MongoDB');
  }
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const data = {};

    for (const collection of collections) {
      const docs = await db.collection(collection.name).find().toArray();
      data[collection.name] = docs;
    }
    return data;
  } catch (error) {
    console.error('Error al obtener la base de datos:', error);
    throw error;
  }
}

module.exports = { connectDB, getFullDatabase, mongoose };