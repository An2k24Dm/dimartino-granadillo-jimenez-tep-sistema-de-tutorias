# 📘 Sistema de Tutorías Académicas Universitarias

Proyecto final - Tópicos Especiales de Programación  
Backend API construida con NestJS, TypeORM y PostgreSQL

---

## 🧰 Preparación del entorno de desarrollo (todos los integrantes)

Cada miembro del equipo debe seguir estos pasos para configurar su entorno correctamente y contribuir al proyecto.

---

### ✅ 1. Instalar Node.js (incluye npm)

1. Ir a la página oficial:  
   👉 [https://nodejs.org](https://nodejs.org)

2. Descargar la **versión LTS recomendada**

3. Instalar como cualquier programa

4. Verificar la instalación desde la terminal:

```bash
node -v
npm -v
```

---

### ✅ 2. Instalar NestJS CLI (Command Line Interface)

NestJS CLI permite crear módulos, servicios, controladores, y administrar el proyecto desde la terminal.

Instalar globalmente:

```bash
npm install -g @nestjs/cli
```

Verificar:

```bash
nest --version
```

---

### ✅ 3. Instalar las dependencias del proyecto

Este paso es obligatorio para que el proyecto funcione.  
Ejecuta el siguiente comando **dentro de la carpeta del proyecto**:

```bash
npm install
```

Esto creará la carpeta `node_modules` con todas las librerías necesarias (NestJS, TypeORM, PostgreSQL, etc.).

---

### ✅ 4. Ejecutar el servidor en modo desarrollo

Para iniciar el backend NestJS, usa:

```bash
npm run start:dev
```

La API estará disponible en:  
👉 `http://localhost:3000`

---

## 🔁 ¿Cuándo volver a ejecutar `npm install`?

Deberás volver a ejecutar `npm install` si:

- Otro integrante agregó nuevas dependencias
- Se actualizó el archivo `package.json`
- Eliminaste la carpeta `node_modules`
- Cambiaste de equipo o reinstalaste el entorno

---

## 📌 Notas adicionales

- No trabajes directamente en la rama `main`
- Crea una rama `feature/` para tu funcionalidad y haz `pull request` hacia `develop`
- Usa `nest g module`, `nest g controller`, etc., para generar tu código de forma organizada

---

---

## 🗄️ Configuración del ORM (TypeORM + PostgreSQL)

### ✅ 1. Verificar la instalación de TypeORM y el cliente de PostgreSQL

Desde la raíz del proyecto, ejecuta:

```bash
npm list @nestjs/typeorm typeorm pg
```

## Deberás ver algo como: 
dimartino-granadillo-jimenez-tep-sistema-de-tutorias@0.0.1
├── @nestjs/typeorm@11.0.0
├── pg@8.16.0
└── typeorm@0.3.24

---

## 🛠️ Instalación de PostgreSQL (obligatorio para todos)

Cada integrante del equipo debe instalar PostgreSQL localmente para poder ejecutar el backend NestJS en su propia máquina.

---

### ✅ 1. Descargar PostgreSQL

Ir a la página oficial:  
👉 [https://www.postgresql.org/download](https://www.postgresql.org/download)

Selecciona tu sistema operativo (Windows, macOS o Linux) y descarga el instalador.

Durante la instalación:

- **Usuario:** deja el predeterminado `postgres`
- **Contraseña:** coloca una que recuerdes
- **Puerto:** 5432 (por defecto)

✅ Asegúrate de **recordar la contraseña** que colocaste.

---

### ✅ 2. Instalar el manejador que sepas usar

PgAdmin se incluye en la instalación estándar de PostgreSQL.  

---

### ✅ 3. Crear una base de datos para el proyecto

Una vez instalado PostgreSQL, crea una base llamada:

```text
bd_sistema_tutorias
```
## Creación del archivo .env
   Debes crear un archivo .env en la raiz del proyecto y colocar lo siguiente:

### 1. Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME= 'Cambialo_por_tu_usuario'
DB_PASSWORD= 'Cambialo_por_tu_contraseña'
DB_DATABASE= bd_sistema_tutorias

### 2. Configuración del puerto en el main.ts
PORT=3000