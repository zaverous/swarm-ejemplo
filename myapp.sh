#!/bin/bash

# Build y psh
echo "[TASK 1] Build y push imagen de docker frontend"
docker build -t zaverous/myapp-frontend:final ./frontend/
docker push zaverous/myapp-frontend:final 


# Build y push imagen de docker backend
echo "[TASK 2] Build y push imagen de docker backend"
docker build -t zaverous/myapp-backend:final ./backend/
docker push zaverous/myapp-backend:final

# Build y push imagen de docker backend
echo "[TASK 3] Build y push imagen de docker backend"
docker build -t zaverous/mongo-seed:final ./mongo-seed/
docker push zaverous/mongo-seed:final

# Deploy la app 
echo "[TASK 4] Deplegar la app"
docker stack deploy -c docker-swarm-compose.yml myapp

