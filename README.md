# icaron-0225-m4 – Guía de uso y Referencia de la API

Este proyecto es un backend en Node.js/Express con autenticación basada en JWT, validación con express-validator y persistencia con Sequelize usando SQLite por defecto. Proporciona endpoints para registrar usuarios, iniciar sesión y obtener el perfil del usuario autenticado.


## Requisitos
- Node.js LTS (>= 18 recomendado)
- npm (>= 9)


## Instalación
1. Clona el repositorio y entra a la carpeta del proyecto.
2. Instala dependencias:
   - npm install


## Configuración (Variables de entorno)
Puedes configurar estas variables en tu entorno o en un archivo `.env` (si usas un gestor de env), aunque este proyecto no incluye dotenv por defecto. Valores por defecto entre paréntesis:

- PORT (3000): Puerto del servidor HTTP.
- JWT_SECRET (dev-secret-change-me): Secreto para firmar tokens JWT. Cambia este valor en producción.
- DB_DIALECT (sqlite): Dialecto de base de datos. El proyecto está pensado para SQLite por defecto.
- DB_STORAGE (./database.sqlite): Ruta del archivo de base de datos SQLite. En tests se usa `./test.sqlite` si `NODE_ENV=test`.
- NODE_ENV (development): Entorno de ejecución.


## Ejecución
- Desarrollo/Producción simple:
  - npm start
  - El servidor inicia en http://localhost:3000 (o el puerto configurado).

La base de datos se sincroniza automáticamente al inicio (sequelize.sync()).


## Estructura relevante
- app.js: Configuración de la app y montaje de rutas.
- routes/auth.js: Rutas de autenticación (/auth/register, /auth/login).
- routes/users.js: Rutas de usuarios (incluye /users/me protegida por JWT).
- middleware/auth.js: Middleware de autenticación y firma de tokens.
- models/: Definición de Sequelize (User, index.js con la instancia sequelize).


## Modelo User (resumen)
- id (integer, PK, autoincrement)
- name (string, opcional)
- email (string, único, requerido, validado como email)
- passwordHash (string, requerido)

La instancia de User expone:
- user.toSafeJSON(): Devuelve un objeto seguro sin passwordHash: { id, name, email, createdAt, updatedAt }.
- user.checkPassword(plain): Compara con bcrypt.


## Autenticación
- Esquema: Bearer Token (JWT)
- Header: Authorization: Bearer <token>
- Expiración: 7 días


## Convenciones de respuesta de error
Las respuestas de error se devuelven en JSON. Ejemplos:
- { "error": "Mensaje descriptivo" }
- { "errors": [ { "type": "field", "msg": "Email inválido", "path": "email", ... } ] } (cuando falla la validación)

Códigos comunes:
- 400: Validación fallida
- 401: No autenticado o token inválido/expirado
- 404: Recurso no encontrado
- 409: Conflicto (por ejemplo, email ya registrado)
- 500: Error interno


## Referencia de la API
Base URL por defecto: http://localhost:3000


### POST /auth/register
Registra un nuevo usuario y devuelve un token JWT y el usuario en JSON (sin el hash de contraseña).

Body (JSON):
- name (string, opcional)
- email (string, requerido, formato email)
- password (string, requerido, mínimo 6 caracteres)

Respuestas:
- 201 Created
  {
    "user": { "id": 1, "name": "Cosme", "email": "cosme@fulanito.com", "createdAt": "...", "updatedAt": "..." },
    "token": "<jwt>"
  }
- 400 Bad Request (validación): { "errors": [ ... ] }
- 409 Conflict (email repetido): { "error": "Ya existe un usuario con ese email" }
- 500 Internal Server Error

Ejemplo curl:
- curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cosme",
    "email": "cosme@fulanito.com",
    "password": "secreto123"
  }'


### POST /auth/login
Autentica un usuario existente y devuelve un token JWT y el usuario.

Body (JSON):
- email (string, requerido)
- password (string, requerido)

Respuestas:
- 200 OK
  {
    "user": { "id": 1, "name": "Cosme", "email": "cosme@fulanito.com", "createdAt": "...", "updatedAt": "..." },
    "token": "<jwt>"
  }
- 400 Bad Request (validación): { "errors": [ ... ] }
- 401 Unauthorized (credenciales inválidas): { "error": "Credenciales inválidas" }
- 500 Internal Server Error

Ejemplo curl:
- curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cosme@fulanito.com",
    "password": "secreto123"
  }'


### GET /users/me
Devuelve el perfil del usuario autenticado (requiere token JWT).

Headers:
- Authorization: Bearer <token>

Respuestas:
- 200 OK
  { "user": { "id": 1, "name": "Cosme", "email": "cosme@fulanito.com", "createdAt": "...", "updatedAt": "..." } }
- 401 Unauthorized: { "error": "Authorization header missing" } | { "error": "Invalid authorization format" } | { "error": "Invalid or expired token" }
- 404 Not Found: { "error": "Usuario no encontrado" }
- 500 Internal Server Error

Ejemplo curl (suponiendo TOKEN en variable de shell):
- curl http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN"


## Validaciones
- /auth/register
  - name: opcional, string, longitud mínima 1 si se envía.
  - email: requerido, formato email, normalizado (normalizeEmail).
  - password: requerido, mínimo 6 chars.
- /auth/login
  - email: requerido, formato email, normalizado.
  - password: requerido.

Si la validación falla, se devuelve 400 con el arreglo `errors` de express-validator.


## Notas sobre base de datos
- Sequelize crea/sincroniza la tabla `users` al iniciar (sequelize.sync()).
- Para resetear en desarrollo, puedes borrar el archivo `database.sqlite` (se recreará vacío al reiniciar).
- Para usar otra base, ajusta `DB_DIALECT` y credenciales según documentación de Sequelize.


## Migraciones y Seeders (MySQL con sequelize-cli)
Este proyecto incluye migrations y seeders compatibles con MySQL usando `sequelize-cli`.

Pre-requisitos:
- MySQL en ejecución y accesible.
- Variables de entorno para conexión definidas (también las toma de `config/config.js`):
  - DB_HOST (127.0.0.1)
  - DB_PORT (3306)
  - DB_USERNAME (root)
  - DB_PASSWORD (null)
  - DB_NAME (icaron_db)
  - Opcional: DB_NAME_TEST para el entorno `test`.

Instalación de CLI y driver:
- Ya están agregados en `package.json`: `sequelize-cli` y `mysql2`.

Scripts disponibles (atajos):
- Migrar: `npm run migrate`
- Deshacer última migración: `npm run migrate:undo`
- Correr todos los seeders: `npm run seed`
- Deshacer todos los seeders: `npm run seed:undo`

Comandos equivalentes con npx (si prefieres usarlos directamente):
- `npx sequelize-cli db:migrate`
- `npx sequelize-cli db:migrate:undo`
- `npx sequelize-cli db:seed:all`
- `npx sequelize-cli db:seed:undo:all`

Ejemplos de uso (Linux/macOS):
```
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_USERNAME=root
export DB_PASSWORD=tu_password
export DB_NAME=icaron_db

npm run migrate
npm run seed
```

Ejemplo en Windows PowerShell:
```
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="3306"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="tu_password"
$env:DB_NAME="icaron_db"

npm run migrate
npm run seed
```

Notas:
- Las migrations incluidas crean las tablas `users` y `cards` (si existe la migration de cards en el repo). Los seeders insertan un usuario y tarjetas de ejemplo.
- El runtime de la app usa SQLite por defecto; las migrations/seeders están pensadas para ejecutarse contra MySQL con `sequelize-cli` usando la configuración de `config/config.js` y las variables de entorno anteriores.


## Seguridad
- Cambia `JWT_SECRET` antes de desplegar en producción.
- Considera el uso de HTTPS y la rotación de secretos.
- No guardes tokens en almacenamiento no seguro del cliente.


## Troubleshooting
- Error: SQLITE_CANTOPEN => Verifica permisos y ruta de `DB_STORAGE`.
- 401 Invalid or expired token => Revisa el header Authorization y la vigencia del token.
- 409 email ya registrado => Usa un email diferente o realiza login.


## Licencia
Uso educativo. Ajusta según tus necesidades.