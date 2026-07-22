/**
 * Data Layer
 *
 * Responsibilities:
 * - Execute PostgreSQL queries
 * - Persist and retrieve medical devices
 *
 * This layer owns persistence only.
 * It does not contain HTTP logic or business rules.
 */

const { pool } = require("./db");

// Reusable SELECT clause that preserves the API contract
const DEVICE_SELECT = `
SELECT
  id,
  name,
  model,
  manufacturer,
  location,
  status,
  lastservicedate AS "lastServiceDate"
FROM devices
`;

// ---------- READ ----------

async function getAllDevices() {
  const result = await pool.query(`
    ${DEVICE_SELECT}
    ORDER BY id
  `);

  return result.rows;
}

async function getDeviceById(id) {
  const result = await pool.query(
    `
    ${DEVICE_SELECT}
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

// ---------- CREATE ----------

async function addDevice(device) {
  const result = await pool.query(
    `
    INSERT INTO devices
    (
      name,
      model,
      manufacturer,
      location,
      status,
      lastservicedate
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      name,
      model,
      manufacturer,
      location,
      status,
      lastservicedate AS "lastServiceDate"
    `,
    [
      device.name,
      device.model,
      device.manufacturer,
      device.location,
      device.status,
      device.lastServiceDate,
    ]
  );

  return result.rows[0];
}

// ---------- UPDATE ----------

async function updateDevice(id, updates) {
  const existingDevice = await getDeviceById(id);

  if (!existingDevice) {
    return null;
  }

  const updatedDevice = {
    ...existingDevice,
    ...updates,
  };

  const result = await pool.query(
    `
    UPDATE devices
    SET
      name = $1,
      model = $2,
      manufacturer = $3,
      location = $4,
      status = $5,
      lastservicedate = $6
    WHERE id = $7
    RETURNING
      id,
      name,
      model,
      manufacturer,
      location,
      status,
      lastservicedate AS "lastServiceDate"
    `,
    [
      updatedDevice.name,
      updatedDevice.model,
      updatedDevice.manufacturer,
      updatedDevice.location,
      updatedDevice.status,
      updatedDevice.lastServiceDate,
      id,
    ]
  );

  return result.rows[0];
}

// ---------- DELETE ----------

async function deleteDevice(id) {
  const result = await pool.query(
    "DELETE FROM devices WHERE id = $1",
    [id]
  );

  return result.rowCount > 0;
}

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
};