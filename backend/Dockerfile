# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies (including socket.io)
RUN npm install socket.io express 

# Copy backend source code
COPY . .

# Expose the port for the backend
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]

