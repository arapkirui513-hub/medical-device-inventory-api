# Medical Device Inventory API

A RESTful API built with **Node.js**, **Express.js**, and **SQLite** for managing a medical device inventory. The project demonstrates RESTful CRUD operations, Express routing, middleware, JSON request handling, and persistent data storage using SQLite.

---

## Features

- Health check endpoint
- View all medical devices
- View a single device by ID
- Add a new device
- Update an existing device
- Delete a device
- Persistent data storage with SQLite
- Automatic database and table creation
- Automatic sample data seeding on first run
- Request logging middleware
- Centralized error-handling middleware
- JSON request parsing

---

## Tech Stack

- Node.js
- Express.js
- SQLite
- better-sqlite3

---

## Why SQLite?

SQLite was chosen because it:

- Requires no separate database server
- Stores all data in a single database file
- Is lightweight and easy to set up
- Persists data after server restarts
- Is well suited for learning SQL and backend persistence

Unlike the original implementation, which stored devices in memory, this version stores all device records inside a SQLite database.

---

## Database Initialization

When the server starts it automatically:

- Creates the SQLite database if it does not exist
- Creates the `devices` table if it does not exist
- Inserts three sample medical devices only when the table is empty

This allows anyone cloning the repository to start the project without manually creating a database.

> **Note:** The generated `devices.db` file is excluded from Git using `.gitignore` because it is created automatically when the application starts.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/arapkirui513-hub/medical-device-inventory-api.git
```

Navigate into the project:

```bash
cd medical-device-inventory-api
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API runs at:

```
http://localhost:3000
```

---

## API Endpoints

### Health Check

| Method | Endpoint |
|---------|----------|
| GET | `/` |

Response:

```json
{
  "message": "Medical Device API is running"
}
```

---

### Get All Devices

| Method | Endpoint |
|---------|----------|
| GET | `/devices` |

---

### Get Device by ID

| Method | Endpoint |
|---------|----------|
| GET | `/devices/:id` |

Example:

```
GET /devices/1
```

---

### Add Device

| Method | Endpoint |
|---------|----------|
| POST | `/devices` |

Example request body:

```json
{
  "name": "ECG Machine",
  "model": "ECG-200",
  "manufacturer": "Philips",
  "location": "Cardiology",
  "status": "active",
  "lastServiceDate": "2026-07-20"
}
```

---

### Update Device

| Method | Endpoint |
|---------|----------|
| PUT | `/devices/:id` |

Example:

```json
{
  "status": "maintenance"
}
```

---

### Delete Device

| Method | Endpoint |
|---------|----------|
| DELETE | `/devices/:id` |

---

## Example Device

```json
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

---

## Database Screenshot

The screenshot below shows the **devices** table opened in **DB Browser for SQLite** after completing the SQLite migration.

![DB Browser for SQLite showing the devices table](docs/database-browser.png)

---

## Project Structure

```
medical-device-inventory-api/
│
├── data/
│   ├── db.js
│   └── devices.js
│
├── docs/
│   └── database-browser.png
│
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
│
├── routes/
│   └── devices.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## Architecture

The REST API remained exactly the same throughout the migration.

Clients still use:

- `GET /devices`
- `GET /devices/:id`
- `POST /devices`
- `PUT /devices/:id`
- `DELETE /devices/:id`

Only the persistence layer changed.

### Before

```
Client
    │
    ▼
Express API
    │
    ▼
In-memory JavaScript Array
```

### After

```
Client
    │
    ▼
Express API
    │
    ▼
SQLite Database
```

This demonstrates an important backend engineering principle:

> The API defines **what** the application does, while the database defines **where** the application stores its data.

---

## What Changed During the Migration

The REST API remained the same throughout the migration. Existing clients continued using the same endpoints and request formats.

The main change was in the persistence layer:

- Before the migration, devices were stored in an in-memory JavaScript array.
- After the migration, devices are stored in a SQLite database.

During development, an important issue was discovered in the original POST implementation. The route generated new IDs by looking at the last item in the in-memory array. After migrating to SQLite, this approach became incorrect because the database is responsible for generating primary keys.

The solution was to let SQLite assign the ID using:

```sql
INTEGER PRIMARY KEY AUTOINCREMENT
```

The API now inserts a new record and returns the row created by the database. This prevents ID reuse after deletions and keeps identifier generation consistent with the database schema.

This migration reinforced an important backend engineering principle:

> Business logic belongs in the application layer. Persistent identifiers belong to the database.

---

## Design Decisions

### Why AUTOINCREMENT?

SQLite generates identifiers using:

```sql
INTEGER PRIMARY KEY AUTOINCREMENT
```

This guarantees that every device receives a unique identifier, even if previous records are deleted. The application no longer calculates IDs manually.

### Why Validation Happens in Express

Required fields and default values are application rules.

The Express route validates incoming requests and supplies default values when needed. SQLite simply stores the validated data it receives without interpreting or inventing business meaning.

---

## SQL Queries Used During Development

The following queries were used to verify that the SQLite database behaved correctly during development.

| Question | SQL Query | Why SQL Was Appropriate | Design Decision |
|----------|-----------|-------------------------|-----------------|
| Are all seeded and newly created devices stored correctly? | `SELECT * FROM devices;` | Retrieves every record exactly as stored in the database. | Confirmed that CRUD operations were persisting data rather than using temporary memory. |
| How many devices currently exist? | `SELECT COUNT(*) AS total_devices FROM devices;` | SQL aggregation is more efficient than counting records in application code. | Demonstrated that summary calculations belong in the database. |
| Can existing records be updated successfully? | `UPDATE devices SET status = 'maintenance' WHERE id = 2;` | Directly modifies the stored record while preserving its identity. | Verified that updates modify existing rows instead of creating new ones. |

---

## Assignment Objectives Demonstrated

- Express server setup
- RESTful API design
- CRUD operations
- Route parameters
- Middleware
- JSON request handling
- Error handling
- SQLite integration
- SQL CRUD operations
- Automatic database creation
- Automatic table creation
- Automatic sample data seeding
- Persistent data storage
- Separation of application logic from persistence

---

## Testing

The project was tested using:

- Thunder Client
- DB Browser for SQLite

### REST API Tests

- ✅ GET /
- ✅ GET /devices
- ✅ GET /devices/:id
- ✅ POST /devices
- ✅ PUT /devices/:id
- ✅ DELETE /devices/:id

### Database Verification

The following checks were performed in DB Browser for SQLite:

- Verified that the database and table were created automatically.
- Confirmed that sample devices were seeded only once.
- Verified that newly created devices persisted after restarting the server.
- Confirmed that updates modified existing records.
- Confirmed that deleted records were removed permanently.
- Verified that SQLite continued generating unique IDs after deletions.

---

## Learning Outcomes

This project demonstrates how an application can migrate from an in-memory data store to a persistent SQLite database without changing its REST API.

The migration reinforced several backend engineering principles:

- APIs define application behavior, while databases define persistence.
- Business validation belongs in the application layer.
- Identifier generation belongs in the database.
- Persistence should preserve facts without interpreting business meaning.
- Separating application logic from storage allows the persistence layer to change without affecting API consumers.
