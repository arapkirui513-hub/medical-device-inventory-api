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

// ---------- READ ----------

function getAllDevices() {
  return db.prepare("SELECT * FROM devices").all();
}

function getDeviceById(id) {
  return db.prepare("SELECT * FROM devices WHERE id = ?").get(id);
}

// ---------- CREATE ----------

function addDevice(device) {
  const insert = db.prepare(`
    INSERT INTO devices (
      name,
      model,
      manufacturer,
      location,
      status,
      lastServiceDate
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    device.name,
    device.model,
    device.manufacturer,
    device.location,
    device.status,
    device.lastServiceDate
  );

  // Return the row exactly as SQLite stored it,
  // including the database-generated ID.
  return db
    .prepare("SELECT * FROM devices WHERE id = ?")
    .get(result.lastInsertRowid);
}

// ---------- UPDATE ----------
// Stage 3

function updateDevice(id, updates) {
  throw new Error("Stage 3: updateDevice() not implemented yet");
}

// ---------- DELETE ----------
// Stage 3

function deleteDevice(id) {
  throw new Error("Stage 3: deleteDevice() not implemented yet");
}

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
};