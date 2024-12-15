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


### **Despliegue en Swarm: Problemas y Topología del Proyecto**

#### **Topología del Proyecto**

El proyecto está compuesto por los siguientes servicios y nodos dentro de Docker Swarm:

1.  **Nodos**
    
    *   **Leader (cimsi-tests):**
        *   IP Pública: `135.236.97.129`
        *   IP Privada: `10.1.0.4`
    *   **Worker 1:**
        *   IP Privada: `10.1.0.5`
2.  **Servicios**
    
    *   **myapp\_frontend**
        *   Proporciona la interfaz del usuario.
        *   Puerto interno: `5173`
    *   **myapp\_backend**
        *   Gestiona la API y lógica del servidor.
        *   Puerto interno: `3001`
    *   **mongo y mongo-seed**
        *   Base de datos y contenedor temporal para inicialización.
3.  **Red de Docker Swarm**
    
    *   Red `myapp_cimsi_app_network` con **driver overlay**, que conecta todos los servicios dentro de Swarm.

#### **Problema Principal**

El mayor desafío se encuentra en el **enrutamiento de tráfico** hacia los contenedores dentro del clúster de Docker Swarm utilizando Nginx como proxy inverso:

1.  **Ruta de Red Actual**:
    
    *   Tráfico de la IP pública del servidor → Nginx en `10.1.0.4` (Leader) → Contenedor `myapp_frontend` y `myapp_backend`.
2.  **Error con Doble Proxy**:
    
    *   El tráfico pasa por **dos proxies Nginx**: uno en el host (configurado manualmente) y el segundo en un contenedor de Swarm.
    *   Esto genera problemas, como:
        *   **Desconexión de WebSockets.**
        *   **Peticiones con rutas incorrectas** (por ejemplo, `/api/api/...`).
3.  **Nginx se Detiene**:
    
    *   El contenedor Nginx deja de funcionar después de unos segundos debido a conflictos en los puertos o a problemas de configuración en la red de Swarm.

#### **Posibles Soluciones**

1.  **Proxy Único con Nginx**
    
    *   Configurar Nginx en el **host (Leader)** directamente y **eliminar el contenedor Nginx** dentro de Docker Swarm.
    *   Redirigir el tráfico de la IP pública a los servicios Swarm utilizando los nombres de los servicios (`myapp_frontend` y `myapp_backend`) gracias a la red `overlay`.
    
    **Ejemplo de Configuración Nginx:**
    
    ```nginx
    server {
        listen 80;
    
        location / {
            proxy_pass http://myapp_frontend:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    
        location /api/ {
            proxy_pass http://myapp_backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    ```
    
2.  **Comprobación de Red**
    
    *   Verificar que los nombres de los servicios (ej. `myapp_frontend` y `myapp_backend`) sean **resueltos correctamente** por el proxy Nginx en el host utilizando la red Swarm:
        
        ```bash
        docker exec -it <nginx_container> ping myapp_frontend
        ```
        
3.  **Eliminar el Doble Proxy**
    
    *   Reconfigurar la aplicación para eliminar dependencias de múltiples proxies.
    *   Asegurarse de que todas las solicitudes sean dirigidas al proxy principal en el Leader.
4.  **Uso de Nginx Health Checks**
    
    *   Configurar **health checks** en el servicio Nginx para evitar que se detenga inesperadamente.

* * *

#### **Conclusión**

La configuración actual requiere redirigir correctamente el tráfico desde el proxy Nginx en el host al servicio Swarm utilizando los nombres de los servicios. Eliminar el contenedor Nginx innecesario y simplificar la arquitectura puede resolver los problemas de desconexión y doble proxy.

