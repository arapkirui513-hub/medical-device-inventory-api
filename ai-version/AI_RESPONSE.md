Below is a complete project structure that satisfies your requirements.

---

# Project Structure

```text
medical-devices-api/
│── docker-compose.yml
│── Dockerfile
│── package.json
│── .env
│── server.js
│── db.js
│── init.js
│── seed.js
│── routes/
│     └── devices.js
```

---

# package.json

```json
{
  "name": "medical-devices-api",
  "version": "1.0.0",
  "description": "Medical Devices REST API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "pg": "^8.12.0"
  }
}
```

---

# .env

```env
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=medicaldb
```

---

# Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

---

# docker-compose.yml

```yaml
version: '3.9'

services:

  db:
    image: postgres:16
    restart: always

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: medicaldb

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:

    build: .

    ports:
      - "3000:3000"

    depends_on:
      - db

    env_file:
      - .env

volumes:
  postgres_data:
```

---

# db.js

```javascript
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool;
```

---

# init.js

Creates table automatically.

```javascript
const pool = require("./db");

async function initializeDatabase() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS devices(

            id SERIAL PRIMARY KEY,

            name VARCHAR(100) NOT NULL,

            manufacturer VARCHAR(100),

            model VARCHAR(100),

            location VARCHAR(100),

            status VARCHAR(30),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

}

module.exports = initializeDatabase;
```

---

# seed.js

Seeds only if table is empty.

```javascript
const pool = require("./db");

async function seedDatabase(){

    const result = await pool.query(
        "SELECT COUNT(*) FROM devices"
    );

    if(Number(result.rows[0].count) === 0){

        await pool.query(`
        INSERT INTO devices
        (name, manufacturer, model, location, status)

        VALUES

        ('ECG Machine','Philips','ECG100','ICU','Available'),

        ('Ventilator','GE','V200','ICU','In Use'),

        ('Infusion Pump','Baxter','IP300','Ward A','Available');
        `);

        console.log("Sample data inserted.");
    }

}

module.exports = seedDatabase;
```

---

# routes/devices.js

```javascript
const express = require("express");
const router = express.Router();

const pool = require("../db");


// GET ALL

router.get("/", async(req,res)=>{

    const result = await pool.query(
        "SELECT * FROM devices ORDER BY id"
    );

    res.json(result.rows);

});


// GET ONE

router.get("/:id", async(req,res)=>{

    const result = await pool.query(

        "SELECT * FROM devices WHERE id=$1",

        [req.params.id]
    );

    if(result.rows.length===0){

        return res.status(404).json({
            message:"Device not found"
        });

    }

    res.json(result.rows[0]);

});


// CREATE

router.post("/", async(req,res)=>{

    const {
        name,
        manufacturer,
        model,
        location,
        status
    } = req.body;

    const result = await pool.query(

`INSERT INTO devices
(name,manufacturer,model,location,status)

VALUES($1,$2,$3,$4,$5)

RETURNING *`,

[
name,
manufacturer,
model,
location,
status
]);

res.status(201).json(result.rows[0]);

});


// UPDATE

router.put("/:id", async(req,res)=>{

const {
name,
manufacturer,
model,
location,
status
}=req.body;

const result = await pool.query(

`UPDATE devices

SET

name=$1,

manufacturer=$2,

model=$3,

location=$4,

status=$5

WHERE id=$6

RETURNING *`,

[
name,
manufacturer,
model,
location,
status,
req.params.id
]);

if(result.rows.length===0){

return res.status(404).json({
message:"Not found"
});

}

res.json(result.rows[0]);

});


// DELETE

router.delete("/:id", async(req,res)=>{

const result=await pool.query(

"DELETE FROM devices WHERE id=$1 RETURNING *",

[req.params.id]

);

if(result.rows.length===0){

return res.status(404).json({
message:"Not found"
});

}

res.json({
message:"Deleted successfully"
});

});

module.exports=router;
```

---

# server.js

```javascript
require("dotenv").config();

const express = require("express");

const initializeDatabase = require("./init");
const seedDatabase = require("./seed");

const app = express();

app.use(express.json());

app.use("/devices", require("./routes/devices"));

const PORT = process.env.PORT || 3000;

async function start(){

    try{

        await initializeDatabase();

        await seedDatabase();

        app.listen(PORT, ()=>{

            console.log(`Server running on port ${PORT}`);

        });

    }catch(err){

        console.error(err);

    }

}

start();
```

---

# Start the Project

```bash
docker compose up --build
```

---

# API Endpoints

## Get all devices

```http
GET /devices
```

---

## Get one device

```http
GET /devices/1
```

---

## Create device

```http
POST /devices
Content-Type: application/json

{
  "name":"Patient Monitor",
  "manufacturer":"Mindray",
  "model":"PM800",
  "location":"Emergency",
  "status":"Available"
}
```

---

## Update device

```http
PUT /devices/1
Content-Type: application/json

{
  "name":"Updated Monitor",
  "manufacturer":"Mindray",
  "model":"PM900",
  "location":"ICU",
  "status":"In Service"
}
```

---

## Delete device

```http
DELETE /devices/1
```

This implementation:

* Uses **Node.js + Express** for the REST API.
* Stores data in **PostgreSQL** running in **Docker**.
* Uses **Docker Compose** to start both the API and database together.
* Reads configuration from **environment variables** via `.env`.
* Automatically **creates the `devices` table** if it doesn't exist.
* **Seeds sample data** only when the table is empty (first run).
* Implements full **CRUD** endpoints (`GET`, `POST`, `PUT`, `DELETE`) for managing medical devices.
