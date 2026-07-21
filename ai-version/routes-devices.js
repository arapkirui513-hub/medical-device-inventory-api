const express = require("express");
const {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
} = require("../data/devices");

const router = express.Router();

function parseDeviceId(req, next) {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    const error = new Error("Invalid device id");
    error.status = 400;
    next(error);
    return null;
  }

  return id;
}

router.get("/", (req, res) => {
  const devices = getAllDevices();
  res.json(devices);
});

router.get("/:id", (req, res, next) => {
  const id = parseDeviceId(req, next);
  if (id === null) return;

  const device = getDeviceById(id);

  if (!device) {
    const error = new Error("Device not found");
    error.status = 404;
    return next(error);
  }

  res.json(device);
});

router.post("/", (req, res, next) => {
  const {
    name,
    model,
    manufacturer,
    location,
    status,
    lastServiceDate,
  } = req.body;

  if (!name || !model || !manufacturer) {
    const error = new Error("name, model, and manufacturer are required");
    error.status = 400;
    return next(error);
  }

  const newDevice = {
    name,
    model,
    manufacturer,
    location: location || "Unknown",
    status: status || "active",
    lastServiceDate: lastServiceDate || new Date().toISOString().slice(0, 10),
  };

  const createdDevice = addDevice(newDevice);
  res.status(201).json(createdDevice);
});

router.put("/:id", (req, res, next) => {
  const id = parseDeviceId(req, next);
  if (id === null) return;

  const updatedDevice = updateDevice(id, req.body);

  if (!updatedDevice) {
    const error = new Error("Device not found");
    error.status = 404;
    return next(error);
  }

  res.json(updatedDevice);
});

router.delete("/:id", (req, res, next) => {
  const id = parseDeviceId(req, next);
  if (id === null) return;

  const success = deleteDevice(id);

  if (!success) {
    const error = new Error("Device not found");
    error.status = 404;
    return next(error);
  }

  res.status(204).send();
});

module.exports = router;