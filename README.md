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

# Author

**Kevin Kirui**

Healthcare AI Product Systems Specialist  
Biomedical Engineering | Backend Development | Healthcare AI Systems

- GitHub: https://github.com/arapkirui513-hub
- LinkedIn: https://www.linkedin.com/in/kevin-kirui-ba9593275/