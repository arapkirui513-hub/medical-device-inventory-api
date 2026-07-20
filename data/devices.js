/**
 * Data Layer
 *
 * Responsibilities:
 * - Execute SQL queries
 * - Persist and retrieve medical devices
 *
 * This layer owns persistence only.
 * It does not contain HTTP logic or business rules.
 */

const db = require("./db");

// Temporary in-memory array used only until Stages 2 and 3
let devices = [];

// ---------- READ (SQLite) ----------

function getAllDevices() {
  return db.prepare("SELECT * FROM devices").all();
}

function getDeviceById(id) {
  return db.prepare("SELECT * FROM devices WHERE id = ?").get(id);
}

// ---------- WRITE (temporary) ----------

function addDevice(device) {
  devices.push(device);
  return device;
}

function updateDevice(id, updates) {
  const index = devices.findIndex(device => device.id === id);

  if (index === -1) {
    return null;
  }

  devices[index] = {
    ...devices[index],
    ...updates
  };

  return devices[index];
}

function deleteDevice(id) {
  const index = devices.findIndex(device => device.id === id);

  if (index === -1) {
    return false;
  }

  devices.splice(index, 1);

  return true;
}

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice
};