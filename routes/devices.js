/**
 * Routes Layer
 *
 * Responsibilities:
 * - Receive HTTP requests
 * - Validate input
 * - Call the data layer
 * - Return HTTP responses
 *
 * This layer does not know how the database works.
 */

const express = require("express");

const {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
} = require("../data/devices");

const router = express.Router();

// ---------- GET ALL DEVICES ----------

router.get("/", async (req, res, next) => {
  try {
    const devices = await getAllDevices();
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

// ---------- GET DEVICE BY ID ----------

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const device = await getDeviceById(id);

    if (!device) {
      const error = new Error("Device not found");
      error.status = 404;
      return next(error);
    }

    res.json(device);
  } catch (error) {
    next(error);
  }
});

// ---------- CREATE DEVICE ----------

router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      model,
      manufacturer,
      location,
      status,
      lastServiceDate,
    } = req.body;

    if (!name || !model || !manufacturer) {
      const error = new Error(
        "name, model, and manufacturer are required"
      );
      error.status = 400;
      return next(error);
    }

    const newDevice = {
      name,
      model,
      manufacturer,
      location: location || "Unknown",
      status: status || "active",
      lastServiceDate:
        lastServiceDate || new Date().toISOString().slice(0, 10),
    };

    const createdDevice = await addDevice(newDevice);

    res.status(201).json(createdDevice);
  } catch (error) {
    next(error);
  }
});

// ---------- UPDATE DEVICE ----------

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const updatedDevice = await updateDevice(id, req.body);

    if (!updatedDevice) {
      const error = new Error("Device not found");
      error.status = 404;
      return next(error);
    }

    res.json(updatedDevice);
  } catch (error) {
    next(error);
  }
});

// ---------- DELETE DEVICE ----------

router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await deleteDevice(id);

    if (!success) {
      const error = new Error("Device not found");
      error.status = 404;
      return next(error);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;