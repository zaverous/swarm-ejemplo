# Usa una imagen de Node.js como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Copia el archivo .env
COPY .env .

# Expone el puerto que utiliza el servidor backend
EXPOSE 3001

# Comando para ejecutar el servidor
CMD ["node", "server.js"]
