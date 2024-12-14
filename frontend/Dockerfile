# Use a Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the root-level package.json and package-lock.json
COPY package*.json ./

# Copy the chat-app package.json and package-lock.json
COPY ./chat-app/package*.json ./chat-app/

# Install dependencies (only root-level dependencies, if any)
RUN npm install

# Copy the rest of the code into the container
COPY . .

# Change to the chat-app working directory
WORKDIR /app/chat-app


# Install dependencies specific to chat-app
RUN npm install --force

# Add node_modules/.bin to PATH
#ENV PATH /app/chat-app/node_modules/.bin:$PATH

#RUN chmod -R 755 /app/chat-app/node_modules/.bin

# Expose the port used by Vite (default: 5173)
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]

