// server.js
const express = require("express");
const devicesRouter = require("./routes/devices");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Initialize the SQLite database
require("./data/db");

const app = express();

// Core middleware
app.use(express.json());          // Parse JSON request bodies
app.use(logger);                  // Custom request logger

// Health-check route
app.get('/', (req, res) => {
  res.json({ message: 'Medical Device API is running' });
});

// Devices routes (mounted under /devices)
app.use('/devices', devicesRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

// Use environment port if available, else 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});