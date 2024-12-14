docker build -t myapp_backend ./backend
docker build -t myapp_frontend ./frontend
docker build -t mongo_seed ./mongo-seed


docker stack deploy -c docker-swarm-compose.yml myapp
