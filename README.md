Proyecto DevOps - CRUD de Usuarios
Autores: Kevin Adrian Santana Maldonado, Alex Robinson Zaruma Suntasig
Descripción
Este proyecto implementa una aplicación web CRUD para la gestión de usuarios utilizando una arquitectura basada en contenedores Docker.
El sistema está compuesto por:
•	Frontend HTML, CSS y JavaScript
•	Backend Node.js con Express
•	Base de datos PostgreSQL
•	Administración de base de datos con pgAdmin
•	Proxy inverso Traefik
•	Administración de contenedores con Portainer
Arquitectura
Internet
     │
     ▼
Traefik
 ├── santana.byronrm.com → Frontend
 ├── backsantana.byronrm.com → Backend API
 ├── pgsantana.byronrm.com → pgAdmin
 └── portainersantana.byronrm.com → Portainer

Backend
     │
     ▼
PostgreSQL
Tecnologías utilizadas
•	Docker
•	Docker Compose
•	Traefik v3
•	Portainer CE
•	PostgreSQL 15
•	pgAdmin 4
•	Node.js 18
•	Express
•	HTML5
•	CSS3
•	JavaScript
Estructura del proyecto
proyecto-devops/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
│
├── frontend/
│   ├── Dockerfile
│   └── index.html
│
├── letsencrypt/
│
├── docker-compose.yml
│
└── README.md
Requisitos
•	Docker
•	Docker Compose
•	Git
Clonar el proyecto
Bash
git clone https://github.com/kamsantana/proyecto-devops.git
cd proyecto-devops
Levantar el proyecto
Construir los contenedores
Bash
docker compose up -d --build
Verificar los contenedores
Bash
docker ps
Detener el proyecto
Bash
docker compose down
Reconstruir imágenes
Bash
docker compose down
docker compose up -d --build
Servicios
Frontend
•	URL: https://santana.byronrm.com
Backend
•	URL: https://backsantana.byronrm.com
•	Health Check: https://backsantana.byronrm.com/health
Endpoints de la API:
Método	Endpoint	Descripción
GET	/usuarios	Listar todos los usuarios
POST	/usuarios	Crear un nuevo usuario
PUT	/usuarios/{id}	Actualizar un usuario existente
DELETE	/usuarios/{id}	Eliminar un usuario
pgAdmin
•	URL: https://pgsantana.byronrm.com
•	Credenciales de acceso:
| Campo | Valor |
| :--- | :--- |
| Correo | admin@admin.com |
| Contraseña | adminpass |
Portainer
•	URL: https://portainersantana.byronrm.com
•	Credenciales de acceso:
| Campo | Valor |
| :--- | :--- |
| Usuario | admin |
| Contraseña | AdminSantana2026! |
Nota: Crear el usuario administrador la primera vez que se accede al panel.
Base de datos
•	Motor: PostgreSQL 15
Variables de entorno:
Fragmento de código
DB_HOST=postgres_db
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=midatabase
Redes Docker
•	traefik-public
•	db-private
Volúmenes
•	postgres_data
•	portainer_data
•	letsencrypt
Despliegue
1.	Clonar el repositorio.
2.	Ejecutar Docker Compose.
3.	Esperar que todos los contenedores estén en estado Up.
4.	Acceder mediante los dominios configurados.
5.	Crear el usuario administrador de Portainer.
6.	Utilizar el sistema CRUD desde el frontend.
Comandos útiles
Ver contenedores
Bash
docker ps
Ver logs
Bash
docker logs backend_santana
Ver redes
Bash
docker network ls
Ver volúmenes
Bash
docker volume ls
Actualizar proyecto
Bash
git pull
docker compose up -d --build
Autores
•	Kevin Adrian Santana Maldonado
•	Alex Robinson Zaruma Suntasig
Carrera: Desarrollo de Software
Institución: Instituto Superior Tecnológico Yavirac 
