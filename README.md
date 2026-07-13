# Medical Device Inventory API



A RESTful API built with **Node.js** and **Express.js** for managing a medical device inventory. The project demonstrates CRUD operations, Express routing, middleware, and JSON request handling.



## Features



- Health check endpoint

- View all medical devices

- View a single device by ID

- Add a new device

- Update an existing device

- Delete a device

- Request logging middleware

- Centralized error-handling middleware

- JSON request parsing



---



## Tech Stack



- Node.js

- Express.js



---



## Installation



Clone the repository:



```bash

git clone <your-github-repository-url>

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



Response



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

  "lastServiceDate": "2026-07-13"

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



## Project Structure



```

medical-device-inventory-api/

│

├── data/

│   └── devices.js

├── middleware/

│   ├── logger.js

│   └── errorHandler.js

├── routes/

│   └── devices.js

├── server.js

├── package.json

└── README.md

```



---



## Assignment Objectives Demonstrated



- Express server setup

- RESTful API design

- CRUD operations

- Route parameters

- Middleware

- JSON request handling

- Error handling





## Testing



The API was tested using:



- Browser (GET endpoints)

- Thunder Client (POST, PUT, DELETE)



### Tested Endpoints



- GET /

- GET /devices

- GET /devices/1

- POST /devices

- PUT /devices/1

- DELETE /devices/1