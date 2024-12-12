Guía de Configuración y Acceso a la Aplicación en Docker Swarm
==============================================================

Capítulo 1: Configuración de Docker Swarm y Despliegue de Aplicaciones
----------------------------------------------------------------------

### Requisitos Previos

1.  **Máquinas necesarias**:
    *   Al menos **3 máquinas** (virtuales o físicas) con Docker instalado.
    *   Una de las máquinas actuará como **nodo maestro** (manager) y las otras como **nodos trabajadores** (workers).
2.  **Red**:
    *   Todas las máquinas deben estar en la misma red y comunicarse entre sí.
    *   Asegúrate de que los puertos **TCP/UDP 2377, 7946 y 4789** estén abiertos.

### Paso 1: Configurar Docker Swarm

1.  **Inicializar el nodo maestro**: En la máquina que será el nodo maestro, ejecuta:
    
    ```css
    docker swarm init --advertise-addr <IP-del-nodo-maestro>
    ```
    
    *   Esto inicializa el clúster de Docker Swarm y devuelve un comando para que los nodos trabajadores se unan al clúster.
2.  **Unir los nodos trabajadores**: En las demás máquinas (nodos trabajadores), ejecuta el comando proporcionado por el nodo maestro, que tendrá el siguiente formato:
    
    ```css
    docker swarm join --token <token-del-swarm> <IP-del-nodo-maestro>:2377
    ```
    
3.  **Verificar el clúster**: En el nodo maestro, ejecuta:
    
    ```bash
    docker node ls
    ```
    
    Esto mostrará una lista de nodos en el clúster y sus estados.
    

* * *

### Paso 2: Configurar Docker Compose

1.  Crea un archivo `docker-compose.yml` en el nodo maestro. Asegúrate de que defina los servicios necesarios (frontend, backend y base de datos) con sus configuraciones.
    
2.  Asegúrate de que las imágenes Docker para los servicios estén disponibles en un registro accesible por todos los nodos (por ejemplo, Docker Hub).
    

* * *

### Paso 3: Desplegar la Aplicación con Docker Swarm

1.  Ejecuta el siguiente comando desde el nodo maestro para desplegar el stack de servicios:
    
    ```arduino
    docker stack deploy -c docker-compose.yml <nombre-del-stack>
    ```
    
    *   Reemplaza `<nombre-del-stack>` con el nombre que quieras asignar a tu aplicación.
2.  Verifica el despliegue:
    
    ```bash
    docker service ls
    ```
    
    Esto mostrará los servicios desplegados y su estado.
    

* * *

Capítulo 2: Acceso a la Aplicación hecha en maquina virtual de azure
----------------------------------
Usuario : cimsi
contrasena : Cimsi24252425
ip publica : 135.236.97.129

### Paso 1: Crear un Túnel SSH para los Servicios

Dado que los servicios están en una red interna (por ejemplo, `10.1.0.4`), es necesario crear un túnel SSH para acceder a ellos desde tu máquina local.

1.  **Configurar el túnel SSH para el frontend**: Ejecuta el siguiente comando en tu máquina local:
    
    ```php-template
    ssh -L 8084:10.1.0.4:3000 <usuario>@<IP-pública-del-nodo-maestro>
    ```
    
2.  **Configurar el túnel SSH para el backend**: Ejecuta el siguiente comando en tu máquina local:
    
    ```php-template
    ssh -L 8085:10.1.0.4:5000 <usuario>@<IP-pública-del-nodo-maestro>
    ```
    
    **⚠ Advertencia**: Esto solo funcionará si el puerto 8085 está configurado para el backend porque está codificado en el archivo de la aplicación frontend.
    
3.  Mantén ambos túneles abiertos mientras accedes a la aplicación.
    

* * *

### Paso 2: Acceder a la Aplicación desde el Navegador

1.  **Frontend**: Abre tu navegador y accede a:
    
    ```arduino
    http://localhost:8084
    ```
    
2.  **Backend (al ser llamado por el frontend)**: El frontend está configurado para llamar al backend a través del túnel SSH en el puerto `8085`. Si el túnel está configurado correctamente, las peticiones al backend funcionarán sin problemas.
    

* * *

Notas Finales
-------------

*   Asegúrate de que las imágenes Docker estén correctamente configuradas y que los servicios tengan sus puertos abiertos.
*   Si encuentras problemas de acceso, verifica las reglas de red, los firewalls, y que los túneles SSH estén activos.
*   Si el backend necesita ser actualizado, realiza los cambios en la imagen Docker correspondiente, sube la nueva imagen al registro, y actualiza el stack con:
    
    ```css
    docker service update --image <nueva-imagen> <nombre-del-servicio>
    ```
    

¡Disfruta de tu aplicación desplegada en Docker Swarm!
