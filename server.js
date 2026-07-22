/**
 * server.js
 *
 * Responsibilities:
 * - Initialize the database
 * - Configure Express
 * - Register middleware and routes
 * - Start the HTTP server
 */

require("dotenv").config();

const express = require("express");
const devicesRouter = require("./routes/devices");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const { initializeDatabase } = require("./data/db");

const app = express();

// Core middleware
app.use(express.json());
app.use(logger);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Medical Device API is running" });
});

// Routes
app.use("/devices", devicesRouter);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start the application only after the database is ready
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();