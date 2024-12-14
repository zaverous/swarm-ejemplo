FROM mongo:6.0

# Copia los archivos BSON al contenedor
COPY *.bson /mongo-seed/

# Script de arranque para restaurar la base de datos
CMD mongorestore --host mongo --port 27017 --db chatApp --drop /mongo-seed