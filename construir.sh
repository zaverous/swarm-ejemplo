# Contruccion de imagen porque compose de swarm no soporta la construcion por yml
# 
# docker build -t myapp_nginx ./nginx  # para construir nginx
docker build -t myapp_backend ./backend
docker build -t myapp_frontend ./frontend
docker build -t mongo_seed ./mongo-seed


docker stack deploy -c docker-swarm-compose.yml myapp
