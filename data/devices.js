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

function updateDevice(id, updates) {
  // Check whether the device exists
  const existingDevice = getDeviceById(id);

  if (!existingDevice) {
    return null;
  }

  // Merge existing values with incoming updates
  const updatedDevice = {
    ...existingDevice,
    ...updates,
  };

  db.prepare(`
    UPDATE devices
    SET
      name = ?,
      model = ?,
      manufacturer = ?,
      location = ?,
      status = ?,
      lastServiceDate = ?
    WHERE id = ?
  `).run(
    updatedDevice.name,
    updatedDevice.model,
    updatedDevice.manufacturer,
    updatedDevice.location,
    updatedDevice.status,
    updatedDevice.lastServiceDate,
    id
  );

  return getDeviceById(id);
}

// ---------- DELETE ----------

function deleteDevice(id) {
  const result = db
    .prepare("DELETE FROM devices WHERE id = ?")
    .run(id);

  return result.changes > 0;
}

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
};