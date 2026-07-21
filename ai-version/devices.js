const db = require("./db");

const allowedFields = [
  "name",
  "model",
  "manufacturer",
  "location",
  "status",
  "lastServiceDate",
];

function getAllDevices() {
  return db.prepare("SELECT * FROM devices ORDER BY id").all();
}

function getDeviceById(id) {
  return db.prepare("SELECT * FROM devices WHERE id = ?").get(id);
}

function addDevice(device) {
  const stmt = db.prepare(`
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

  const result = stmt.run(
    device.name,
    device.model,
    device.manufacturer,
    device.location,
    device.status,
    device.lastServiceDate
  );

  return getDeviceById(result.lastInsertRowid);
}

function updateDevice(id, updates) {
  const existingDevice = getDeviceById(id);

  if (!existingDevice) {
    return null;
  }

  const keys = Object.keys(updates).filter((key) => allowedFields.includes(key));

  if (keys.length === 0) {
    return existingDevice;
  }

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => updates[key]);

  db.prepare(`UPDATE devices SET ${setClause} WHERE id = ?`).run(...values, id);

  return getDeviceById(id);
}

function deleteDevice(id) {
  const result = db.prepare("DELETE FROM devices WHERE id = ?").run(id);
  return result.changes > 0;
}

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
};