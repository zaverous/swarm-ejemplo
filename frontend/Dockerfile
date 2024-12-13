# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies (including socket.io-client)
RUN npm install socket.io-client express

# Copy frontend source code
COPY . .

# Expose the port for the frontend
EXPOSE 3000

# Start the frontend server
CMD ["node", "server.js"]

