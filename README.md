# Actualizacion de la dockerizacion
 * Se ha implementado un contenedor temporal llamado mongo-seed que abastece y crea la base de datos chatApp
 * Se crean los contendore, el volumen para los datos, la red de docker y funciona la conectividad pero no se resuelven las peticiones del front. Seguramente sea un problema de configuración de api.js o vite.config.js que no logro solucionar

## Instrucciones
 * Lanzar docker-compose --build desde el directorio raíz con docker desktop instalado

## Comandos interesantes
- Limpiar todo para despliegue limpio
docker-compose down --volumes
docker network prune -f
docker system prune --all --volumes -f

- Despliegue tras limpieza 
docker-compose up --build

- Comprobaciones
docker network ls
docker ps
docker network inspect <NOMBRE_RED> //Se observa que estan los contenedores conectados a la red