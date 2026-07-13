// routes/devices.js
const express = require('express');
const {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice
} = require('../data/devices');

const router = express.Router();

// GET /devices – list all devices
router.get('/', (req, res) => {
  const devices = getAllDevices();
  res.json(devices);
});

// GET /devices/:id – retrieve one device
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const device = getDeviceById(id);

  if (!device) {
    const error = new Error('Device not found');
    error.status = 404;
    return next(error);
  }

  res.json(device);
});

// POST /devices – add a device
router.post('/', (req, res, next) => {
  const { name, model, manufacturer, location, status, lastServiceDate } = req.body;

  if (!name || !model || !manufacturer) {
    const error = new Error('name, model, and manufacturer are required');
    error.status = 400;
    return next(error);
  }

  // Generate a new ID (simple incremental logic)
  const devices = getAllDevices();
  const newId = devices.length > 0 ? devices[devices.length - 1].id + 1 : 1;

  const newDevice = {
    id: newId,
    name,
    model,
    manufacturer,
    location: location || 'Unknown',
    status: status || 'active',
    lastServiceDate: lastServiceDate || new Date().toISOString().slice(0, 10)
  };

  addDevice(newDevice);

  res.status(201).json(newDevice);
});

// PUT /devices/:id – update a device
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const updates = req.body;

  const updatedDevice = updateDevice(id, updates);

  if (!updatedDevice) {
    const error = new Error('Device not found');
    error.status = 404;
    return next(error);
  }

  res.json(updatedDevice);
});

// DELETE /devices/:id – remove a device
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const success = deleteDevice(id);

  if (!success) {
    const error = new Error('Device not found');
    error.status = 404;
    return next(error);
  }

  res.status(204).send(); // No content, successful deletion
});

module.exports = router;