const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "devices.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.prepare(`
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    lastServiceDate TEXT NOT NULL
  )
`).run();

const count = db.prepare("SELECT COUNT(*) AS count FROM devices").get().count;

if (count === 0) {
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

  const seedDevices = [
    ["ECG Monitor", "CardioX-100", "MediTech", "Ward 1", "active", "2026-01-15"],
    ["Infusion Pump", "PumpPro 20", "BioFlow", "ICU", "active", "2026-02-03"],
    ["Defibrillator", "ShockSafe D2", "LifePulse", "Emergency Room", "maintenance", "2026-03-22"],
  ];

  const transaction = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(...row);
    }
  });

  transaction(seedDevices);
}

module.exports = db;