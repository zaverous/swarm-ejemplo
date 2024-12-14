Here's the updated README file with the new instructions for deploying the application to a Docker Swarm or running it locally with `docker-compose`:

* * *

Actualización de la Dockerización
=================================

Se ha implementado un contenedor temporal llamado `mongo-seed` que abastece y crea la base de datos `chatApp`.

Se crean los contenedores, el volumen para los datos, la red de Docker, y funciona la conectividad, pero las peticiones desde el frontend no se resuelven correctamente. Esto probablemente sea un problema de configuración en `api.js` o `vite.config.js`, que aún no se ha logrado solucionar.

* * *

Instrucciones para Despliegue
-----------------------------

### **1\. Desplegar en Docker Swarm**

Para desplegar la aplicación en un clúster de Docker Swarm, ejecuta el siguiente archivo desde el directorio raíz:

```bash
./myapp.sh
```

Este script configurará el despliegue automáticamente en un entorno Swarm. Asegúrate de que Docker Swarm esté inicializado y configurado correctamente.

* * *

### **2\. Ejecutar Localmente con Docker Compose**

Para probar la aplicación en tu máquina local sin usar Docker Swarm, ejecuta:

```bash
docker-compose up --build
```

Esto construirá y levantará todos los contenedores definidos en el archivo `docker-compose.yml`.

* * *

Comandos Interesantes
---------------------

### **Limpieza para un Despliegue Limpio**

Ejecuta los siguientes comandos para asegurarte de empezar con un entorno limpio:

```bash
docker-compose down --volumes
docker network prune -f
docker system prune --all --volumes -f
```

### **Despliegue tras la Limpieza**

Para volver a desplegar tras la limpieza, usa:

```bash
docker-compose up --build
```

* * *

Comprobaciones
--------------

Utiliza estos comandos para verificar el estado de los contenedores, redes y conectividad:

*   Listar redes de Docker:
    
    ```bash
    docker network ls
    ```
    
*   Verificar contenedores en ejecución:
    
    ```bash
    docker ps
    ```
    
*   Inspeccionar la red de Docker y verificar los contenedores conectados:
    
    ```bash
    docker network inspect <NOMBRE_RED>
    ```
    

* * *

### Nota Final

Por favor, revisa las configuraciones en `api.js` y `vite.config.js` para resolver los problemas de conectividad entre el frontend y el backend.

* * *

Let me know if you need further adjustments!
