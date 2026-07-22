![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

# Medical Device Inventory API

A RESTful backend service for managing medical device inventory, built with **Node.js**, **Express**, **PostgreSQL**, and **Docker**.

The project demonstrates layered backend architecture, repository pattern, environment-based configuration, PostgreSQL integration, and containerized deployment using Docker Compose.

---

## Features

- RESTful CRUD API
- PostgreSQL database
- Repository pattern
- Layered architecture
- Automatic database initialization
- Automatic sample data seeding
- Environment-based configuration
- Dockerized application
- Docker Compose deployment
- Persistent PostgreSQL storage using Docker volumes

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST API |
| PostgreSQL 17 | Database |
| pg | PostgreSQL driver |
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

# Project Structure

```text
medical-device-api/
│
├── data/
│   ├── db.js
│   └── devices.js
│
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
│
├── routes/
│   └── devices.js
│
├── docs/
│   └── screenshots/
│       ├── docker-compose-up.png
│       ├── database-browser.png
│       └── get-devices.png
│
├── .dockerignore
├── .env.example
├── .gitignore
├── compose.yaml
├── Dockerfile
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

# Architecture

## Request Flow

```text
                Client
                  │
          GET /devices
                  │
                  ▼
          Express Router
                  │
                  ▼
        Device Repository
                  │
                  ▼
          PostgreSQL Driver
                  │
                  ▼
            PostgreSQL DB
                  │
                  ▼
          JSON Response
```

The project follows a layered architecture.

- **Routes** receive HTTP requests.
- **Repository** executes SQL queries.
- **Database layer** manages PostgreSQL connection, schema creation, and database initialization.

---

# Container Architecture

```text
                  +-----------------------+
                  |      Client           |
                  | (curl / Postman)      |
                  +-----------+-----------+
                              |
                              ▼
                  +-----------------------+
                  |   API Container       |
                  |-----------------------|
                  | Node.js               |
                  | Express               |
                  | Repository Layer      |
                  +-----------+-----------+
                              |
                    Docker Network
                              |
                              ▼
                  +-----------------------+
                  | PostgreSQL Container  |
                  |-----------------------|
                  | PostgreSQL 17         |
                  | Persistent Volume     |
                  +-----------+-----------+
                              |
                              ▼
                    Docker Volume
                 (Persistent Storage)
```

---

# Getting Started

## Prerequisites

- Docker Desktop
- Docker Compose

---

## Clone the repository

```bash
git clone https://github.com/arapkirui513-hub/medical-device-inventory-api.git

cd medical-device-inventory-api
```

---

## Environment Variables

Create a `.env` file from `.env.example`.

Example:

```env
DATABASE_URL=postgres://postgres:dev@db:5432/tasks
PORT=3000
```

---

# Run the Application

Build and start the complete application:

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:3000
```

---

## Stop the Application

```bash
docker compose down
```

Because PostgreSQL uses a Docker volume, your data persists across container restarts.

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/devices` | Retrieve all medical devices |
| GET | `/devices/:id` | Retrieve a single device |
| POST | `/devices` | Create a device |
| PUT | `/devices/:id` | Update a device |
| DELETE | `/devices/:id` | Delete a device |

---

# Example HTTP Response

The following example shows a successful request using `curl -i`, including the HTTP status code, response headers, and JSON payload.

### Request

```bash
curl -i http://localhost:3000/devices/1
```

### Response

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 152
ETag: W/"98-+MrtI/GhGlK1YvR433PhCcyZ6Do"
Date: Wed, 22 Jul 2026 06:41:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": 1,
  "name": "Infusion Pump",
  "model": "IP-3000",
  "manufacturer": "MedEquip Ltd",
  "location": "ICU Ward 3",
  "status": "active",
  "lastServiceDate": "2026-06-01"
}
```

### Error Example

```bash
curl -i http://localhost:3000/devices/abc
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "error": "Invalid device ID"
}
```

---

## Update Behavior

The `PUT /devices/:id` endpoint supports partial updates.

Any fields omitted from the request retain their existing values in the database.

Example:

```json
{
  "status": "maintenance"
}
```

The request above updates only the device status while preserving all other fields.

---

# Example Request

### POST /devices

```json
{
  "name": "ECG Machine",
  "model": "ECG-500",
  "manufacturer": "GE Healthcare",
  "location": "Cardiology",
  "status": "active",
  "lastServiceDate": "2026-07-22"
}
```

---

# Example Response

```json
{
  "id": 4,
  "name": "ECG Machine",
  "model": "ECG-500",
  "manufacturer": "GE Healthcare",
  "location": "Cardiology",
  "status": "active",
  "lastServiceDate": "2026-07-22"
}
```

---

# Database Initialization

On first startup the application automatically:

- Creates the `devices` table if it does not exist.
- Seeds three sample medical devices.
- Connects the application to PostgreSQL.

Subsequent restarts preserve existing data and do not reseed the database.

---

## Data Persistence

PostgreSQL stores its data in a Docker volume, allowing records to survive container restarts.

### Verification

1. Created a new medical device.
2. Stopped the application using:

```bash
docker compose down
```

3. Started the application again:

```bash
docker compose up
```

4. Retrieved all devices and confirmed the newly created record was still present.

![Persistence Proof](docs/screenshots/persistence-proof.png)

---

# Docker Services

| Service | Description |
|----------|-------------|
| API | Node.js + Express |
| Database | PostgreSQL 17 |
| Storage | Docker Volume |

---

# Screenshots

## Docker Compose

Application running with both API and PostgreSQL containers.

![Docker Compose](docs/screenshots/docker-compose-up.png)

---

## Database

Medical devices stored in PostgreSQL.

![Database Browser](docs/screenshots/database-browser.png)

---

## API Response

Retrieving all devices from the PostgreSQL API.

![GET Devices](docs/screenshots/get-devices.png)

---

# Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm start
```

---

# Key Learning Outcomes

This project demonstrates:

- Designing RESTful APIs with Express
- Repository pattern implementation
- PostgreSQL integration
- Environment-based configuration
- Database initialization and seeding
- Docker containerization
- Docker Compose orchestration
- Persistent storage with Docker volumes
- Layered backend architecture

---

# AI Assistance vs. My Contributions

AI was used as a development assistant throughout this project. Final implementation decisions, debugging, testing, and validation were completed by me.

## Prompt Used

> Help me migrate an Express.js REST API from SQLite to PostgreSQL, containerize it with Docker Compose, and preserve the existing layered architecture and API behavior.

## My Contributions

- Migrated the application from SQLite to PostgreSQL while preserving the existing route layer and API contract.
- Installed and configured Docker Desktop, WSL, PostgreSQL, and Docker Compose on Windows.
- Diagnosed and resolved Docker and PostgreSQL startup issues, including container initialization failures and connection errors.
- Refactored the repository layer to preserve camelCase API responses while using PostgreSQL.
- Fixed the `PUT` update logic after identifying field-name mismatches during testing.
- Fixed invalid ID handling by returning `400 Bad Request` instead of allowing PostgreSQL to throw an exception.
- Updated the error handler to match the assignment specification and prevent internal database errors from being exposed to API consumers.
- Verified CRUD functionality, Docker persistence, and PostgreSQL integration through end-to-end testing.
- Wrote the project documentation, architecture diagrams, setup instructions, and usage examples.

## How AI Helped

AI accelerated development by:

- Explaining PostgreSQL integration.
- Suggesting Docker and Docker Compose configuration.
- Reviewing architecture decisions.
- Identifying potential improvements during code review.
- Assisting with README structure and documentation.

---

# Author

**Kevin Kirui**

Healthcare AI Product Systems Specialist  
Biomedical Engineering | Backend Development | Healthcare AI Systems

- GitHub: https://github.com/arapkirui513-hub
- LinkedIn: https://www.linkedin.com/in/kevin-kirui-ba9593275/