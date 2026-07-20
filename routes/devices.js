// routes/devices.js
const express = require("express");
const {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
} = require("../data/devices");

const router = express.Router();

// GET /devices – list all devices
router.get("/", (req, res) => {
  const devices = getAllDevices();
  res.json(devices);
});

// GET /devices/:id – retrieve one device
router.get("/:id", (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const device = getDeviceById(id);

  if (!device) {
    const error = new Error("Device not found");
    error.status = 404;
    return next(error);
  }

  res.json(device);
});

// POST /devices – add a device
router.post("/", (req, res, next) => {
  const {
    name,
    model,
    manufacturer,
    location,
    status,
    lastServiceDate,
  } = req.body;

  // Validate required fields
  if (!name || !model || !manufacturer) {
    const error = new Error("name, model, and manufacturer are required");
    error.status = 400;
    return next(error);
  }

  // Build the device object.
  // SQLite generates the ID.
  const newDevice = {
    name,
    model,
    manufacturer,
    location: location || "Unknown",
    status: status || "active",
    lastServiceDate:
      lastServiceDate || new Date().toISOString().slice(0, 10),
  };

  // Store in SQLite and return the created record
  const createdDevice = addDevice(newDevice);

  res.status(201).json(createdDevice);
});

// DELETE /devices/:id – remove a device
router.delete("/:id", (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const success = deleteDevice(id);

  if (!success) {
    const error = new Error("Device not found");
    error.status = 404;
    return next(error);
  }

  res.status(204).send();
});

module.exports = router;