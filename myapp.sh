#!/bin/bash

# Build y psh
echo "[TASK 1] Build y push imagen de docker frontend"
docker build -t zaverous/myapp-frontend:test ./frontend/
docker push zaverous/myapp-frontend:test 


# Build y push imagen de docker backend
echo "[TASK 2] Build y push imagen de docker backend"
docker build -t zaverous/myapp-backend:test ./backend/
docker push zaverous/myapp-backend:test

# Deploy la app 
echo "[TASK 3] Deplegar la app"
docker stack deploy -c docker-compose.yaml myapp

