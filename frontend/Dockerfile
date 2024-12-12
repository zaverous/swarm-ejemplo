# Use Node.js base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy files
COPY server.js .

# Install express
RUN npm install express

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

