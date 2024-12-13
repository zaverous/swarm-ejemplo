Implementación de Frontend y Backend con Nginx y Socket.IO
==========================================================

Este archivo describe los requisitos y pasos para implementar una aplicación que utiliza un **frontend** y un **backend** configurados con **Nginx** y **Socket.IO** para manejar conexiones WebSocket correctamente. Además, se explica cómo acceder a la aplicación desde un navegador utilizando la IP pública.

* * *

Requisitos
----------

1.  **Nginx instalado**:
    
    *   Asegúrate de que **Nginx** está instalado en el servidor donde se alojará la aplicación.
    *   En sistemas basados en Ubuntu/Debian, puedes instalarlo con:
        
        ```bash
        sudo apt update
        sudo apt install nginx
        ```
        
2.  **Configuración de Socket.IO**:
    
    *   En el backend, asegúrate de configurar el middleware de CORS en el servidor de **Socket.IO** para permitir conexiones desde el frontend. El archivo `server.js` debe incluir:
        
        ```javascript
        const io = new Server(server, {
          cors: {
            origin: 'http://<ip-publica>',
            methods: ['GET', 'POST'],
            credentials: true
          },
          transport: ['websocket'] //Force Websocket as the only transport
        });
        ```
        
    *   Sustituye `<ip-publica>` por la IP pública de tu servidor.
3.  **Configuración del frontend**:
    
    *   En el cliente de **Socket.IO**, apunta la conexión al proxy configurado en Nginx:
        
        ```javascript
          const socket = io('http://135.236.97.129', {
            transports: ['websocket'], // Force WebSocket transport
        });
        ```
        

* * *

Configuración de Nginx
----------------------

1.  Accede al archivo de configuración de Nginx:
    
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
    
2.  Añade el siguiente bloque de configuración para configurar los proxys para el frontend y el backend:
    
    ```nginx
    server {
        listen 80;
        server_name <ip-publica>;
    
    
        # Proxy para el frontend
        location / {
            proxy_pass http://10.1.0.4:3000; # Dirección privada del frontend
            proxy_http_version 1.1;
            proxy_set_header Host $host;
        }

        # proxy to the backend
        location /api/ {
            proxy_pass http://10.1.0.4:5000; # Backend server
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }

        location /socket.io/ {
            proxy_pass http://10.1.0.4:5000;  # Backend server
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    
3.  Guarda los cambios y reinicia Nginx para aplicar la configuración:
    
    ```bash
    sudo systemctl restart nginx
    ```
    

* * *

Acceso a la Aplicación Hecha en Azure
----------------------


1.  Desde tu navegador, accede a la aplicación usando la **IP pública** del servidor.
    
2.  **Frontend**:
    
    *   Simplemente abre `http://<ip-publica>` en tu navegador.
    *   El frontend debe cargarse correctamente.
3.  **Backend (WebSocket)**:
    
    *   Las solicitudes del frontend al backend (`/api/`) se redirigirán automáticamente a través del proxy configurado en Nginx.

**Por si quiere ver una qu funciona en maquinas de azure accede esta pagina http://135.236.97.129/**

* * *

Notas Adicionales
-----------------

*   **Firewall**:
    
    *   Asegúrate de que el puerto `80` está abierto en el firewall de tu servidor para permitir el tráfico HTTP.
    *   Si estás usando un firewall como `ufw`, habilítalo con:
        
        ```bash
        sudo ufw allow 80/tcp
        sudo ufw reload
        ```
        
*   **CORS**:
    
    *   Si el frontend o backend se encuentra en un dominio diferente, asegúrate de actualizar las reglas de CORS en el backend.

* * *

Con esta configuración, tu aplicación debería estar accesible desde cualquier navegador utilizando la IP pública del servidor. ¡Buena suerte con la implementación! 😊
