# Chat en vivo

## Tecnologías a usar
- **Frontend**: React.js + Vite
- **Backend**: Node.js & Socket.IO para mensajes en tiempo real
- **Base de Datos**: MongoDB
- **Almacenamiento y autenticación**: Supabase para medios y avatares
- **Administración de estado**: Redux para una experiencia de usuario fluida


# Instalación de la máquina virtual con Ubuntu 22.04.5 LTS en VirtualBox

## Requisitos previos
Este proyecto requiere la instalacin de VirtualBox, una ISO de Ubuntu 22.04.5 LTS y herramientas de desarrollo que se especificarán más adelante.

## Paso 1: Descargar la ISO de Ubuntu 22.04.5 LTS
Id a la [página](https://releases.ubuntu.com/jammy/) y descargad la ISO de Ubuntu 22.04.5 LTS

## Paso 2: Crear una nueva máquina virtual en VirtualBox con las siguientes especificaciones
1. Abre VirtualBox y haz clic en "Nuevo" para crear una nueva máquina virtual.
2. Especifica el nombre de la máquina virtual (por ejemplo, "Ubuntu-22.04").
3. Selecciona el tipo de sistema operativo como Linux y la versión como Ubuntu (64-bit).
4. Usuario y contraseña que se quieran
7. **Memoria base** 6144 MB (6GB)
8. **Procesador** - 4 CPU
9. **Disco duro** - 45 GB
6. **Configuración de sistema**
9. **Red** - Conectado a NAT
10. **Red** - Avanzado - Reenvío de puertos - Añadir con Nombre React, Protocolo TCP, Puerto Anfitrión 3000 y Puerto Invitado 3000

### Solución de problemas 

1. El teclado se configura en los ajustes del sistema
2. Con este [vídeo](https://www.youtube.com/watch?v=ncUctr7Ygrk) se soluciona el problema de que no se abra la terminal.

# Instalación de Git en Ubuntu
1. `sudo apt update`
2. `sudo apt install git`
3. `git --version`
4. `git config --global user.name "tu_nombre"`
5. `git config --global user.email "tu_correo@dominio.com"`


# Configuración de SSH

## Hay que dar permisos al usuario ubuntu
No es aconsejable que desarrollemos la aplicación con root directamente. Seguid estos pasos y luego al final de todo haced la comprobación que os pongo. Antes de seguir os debe funcionar, por lo que pueda pasar.

1. `chmod 700 ~/.ssh`
2. `sudo chown -R ubuntu:ubuntu /home/ubuntu/.ssh`
3. Confirma que el usuario ubuntu tiene acceso: `ls -ld ~/.ssh`

## Generar clave ssh
Para interactuar con GitHub de forma segura y sin necesidad de ingresar tu contraseña cada vez, es recomendable usar SSH.

1. `ssh-keygen -t rsa -b 4096 -C "tu_correo@dominio.com"`
2. `eval "$(ssh-agent -s)"`
3. `ssh-add ~/.ssh/id_rsa`
4. `cat ~/.ssh/id_rsa.pub` Copia la clave que te da
5. Agrega la clave SSH a tu cuenta de GitHub (en el buscador de la máquina):
6. Ve a GitHub > Settings > SSH and GPG keys > New SSH key, pega la clave pública y guarda.
7. Probad desde ubuntu el siguiente comando: `ssh -T git@github.com` Debe dar un mensaje de bienvenida. 

# Clonar repositorio y configurar el entorno local 
1. `git clone git@github.com:LBM17/CIMSI.git`
2. `cd frontend`
3. `npm install` instala las dependencias del proyecto.
4. `npm run dev` Iniciar el servidor de vite

## Dinámica de trabajo
La idea es que cada uno trabaje en una rama de trabajo, para no hacer cambios sobre el proyecto principal. Cada rama será una tarea del proyecto. Una vez realicéis cambios, podéis subir vuestra rama a GitHub. Cuando uno de nosotros termine una tarea, debemos ir a GitHub y abrir un Pull Request para fusionar su rama con la principal. Es importante que lo revisemos los demás antes de aceptar el Pull Request. 

### Crear rama de trabajo
1. Asegúrate de estar en la rama principal y actualizada `git checkout main` y `git pull origin main`
1. Asegúrate de estar en la rama principal y actualizada `git checkout master` y `git pull origin master`
2. Crea una rama para trabajar en la tarea `git checkout -b feature/mi-nueva-tarea`

### Realizar cambios y hacer commit
1. Haz los cambios necesarios en el proyecto
2. Añade los cambios al control de versiones `git add .`
3. Hacer un commit `git commit -m` "Añadir componente Navbar con estilos básicos"
4. Subir la rama al repositorio remoto `git push origin feature/mi-nueva-tarea`

### Crear un Pull Request o PR
1. Ve al repositorio en GitHub
2. En la página del repositorio, haz clic "Compare & pull request"
3. Selecciona la rama main (o master) como detino y tu rama de trabajo como origen
3. Selecciona la rama master (o master) como detino y tu rama de trabajo como origen
4. Escribe una descripción de los cambios que realizaste y haz clic en "Create Pull Request"

### Revisión y Fusión del PR 
1. Se puede revisar el Pull Request
2. Si todo está correcto, puedes fusionar el PR en la rama principal (main o master)
2. Si todo está correcto, puedes fusionar el PR en la rama principal master
3. Si hay conflictos, sigue las instrucciones de GItHub para resolverlos
4. Después de resolver cualquier conflicto haz un nuevo commit y sube los cambios

### Actuzalizar tu Rama Local con cambios de la Rama Principal 
1. Cambiar a la rama principal `git checkout main`
2. Actualizar la rama principal `git pull origin main`
1. Cambiar a la rama principal `git checkout master`
2. Actualizar la rama principal `git pull origin master`
3. Volver a tu rama de trabajo `git checkout feature/mi-nueva-tarea`
4. Fusionar los cambios de la rama principal `git merge main`
4. Fusionar los cambios de la rama principal `git merge master`

# Buenas prácticas
1. Realiza commits pequeños y frecuentes
2. Usa mensajes claros en los commits
3. Comenta el código
4. Revisa tu código antes de hacer un Pull Request para evitar errores. 
