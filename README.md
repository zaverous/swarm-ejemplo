### Actualización de la Dockerización

#### Cambios Implementados

Se ha implementado un contenedor temporal llamado `mongo-seed` que inicializa y crea la base de datos `chatApp`.  
Los contenedores, el volumen para los datos y la red de Docker funcionan correctamente, pero las peticiones del frontend no se resuelven del todo. Esto podría deberse a problemas de configuración en `api.js` o `vite.config.js`.

* * *

### **Instrucciones**

1.  **Para desplegar con Docker Compose en tu máquina local:**
    
    *   Desde el directorio raíz del proyecto, ejecuta:
        
        ```bash
        docker-compose up --build
        ```
        
    *   Asegúrate de tener instalado Docker Desktop.
2.  **Para desplegar con Docker Swarm:**
    
    *   Usa el script `myapp.sh` que incluye todos los pasos necesarios para el despliegue en Swarm.  
        Ejecútalo desde el directorio raíz del proyecto:
        
        ```bash
        ./myapp.sh
        ```
        

* * *

### **Comandos Útiles**

1.  **Limpieza completa para un despliegue limpio:**
    
    ```bash
    docker-compose down --volumes
    docker network prune -f
    docker system prune --all --volumes -f
    ```
    
2.  **Despliegue tras limpieza:**
    
    ```bash
    docker-compose up --build
    ```
    
3.  **Comprobaciones:**
    
    *   Listar las redes creadas:
        
        ```bash
        docker network ls
        ```
        
    *   Listar los contenedores activos:
        
        ```bash
        docker ps
        ```
        
    *   Inspeccionar una red específica para verificar que los contenedores estén conectados:
        
        ```bash
        docker network inspect <NOMBRE_RED>
        ```
        

* * *

### **Nota sobre Cambios en el Código**

Para que la aplicación funcione correctamente con Docker Swarm, se realizaron modificaciones en el código del frontend.  
Se reemplazaron las referencias a `localhost:3001` por la IP pública del servidor (`135.236.97.129`).

1.  **Archivo:** `./frontend/chat-app/src/pages/Chat/Chat.jsx`
    
    ```javascript
    const newSocket = io('http://135.236.97.129', {
      transports: ['websocket'],
      withCredentials: true,
    });
    ```
    
2.  **Archivo:** `./frontend/chat-app/src/components/ChatBox/ChatBox.jsx`
    
    ```javascript
    const response = await fetch(`http://135.236.97.129/api/Messages?chatId=${activeChatId}`, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${token}`,
      },
    });
    ```
    

* * *

Con estos pasos, puedes desplegar la aplicación tanto en tu máquina local como en Docker Swarm. Si encuentras algún problema, revisa las configuraciones de red y las variables de entorno. 😊
