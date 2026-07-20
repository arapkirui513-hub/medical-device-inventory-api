/**
 * Database Layer
 *
 * Responsibilities:
 * - Open the SQLite database
 * - Create the schema if it doesn't exist
 * - Seed initial data once
 *
 * This layer owns database initialization only.
 * It does not contain CRUD business logic.
 */

const Database = require("better-sqlite3");

// Open (or create) the SQLite database
const db = new Database("devices.db");

// Create the devices table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    lastServiceDate TEXT NOT NULL
  )
`);

// Check whether the table already contains data
const { count } = db
  .prepare("SELECT COUNT(*) AS count FROM devices")
  .get();

// Seed data only on the first run
if (count === 0) {
  const seedDevices = [
    {
      name: "Infusion Pump",
      model: "IP-3000",
      manufacturer: "MedEquip Ltd",
      location: "ICU Ward 3",
      status: "active",
      lastServiceDate: "2026-06-01",
    },
    {
      name: "Ventilator",
      model: "VNT-900",
      manufacturer: "RespiraTech",
      location: "Critical Care Unit",
      status: "maintenance",
      lastServiceDate: "2026-05-20",
    },
    {
      name: "Patient Monitor",
      model: "PM-450",
      manufacturer: "Philips",
      location: "Emergency Department",
      status: "active",
      lastServiceDate: "2026-06-15",
    },
  ];

  const insert = db.prepare(`
    INSERT INTO devices
    (name, model, manufacturer, location, status, lastServiceDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seed = db.transaction((devices) => {
    for (const device of devices) {
      insert.run(
        device.name,
        device.model,
        device.manufacturer,
        device.location,
        device.status,
        device.lastServiceDate
      );
    }
  });

  seed(seedDevices);

  console.log("Database initialized with sample medical devices.");
}

module.exports = db;