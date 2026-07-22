/**
 * Database Layer
 *
 * Responsibilities:
 * - Connect to PostgreSQL
 * - Create the schema if it doesn't exist
 * - Seed initial data once
 *
 * This layer owns database initialization only.
 */

require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  try {
    // Create the devices table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        model TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        lastServiceDate TEXT NOT NULL
      );
    `);

    // Check whether the table already contains data
    const result = await pool.query(
      "SELECT COUNT(*)::int AS count FROM devices"
    );

    // Seed data only on the first run
    if (result.rows[0].count === 0) {
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

      for (const device of seedDevices) {
        await pool.query(
          `
          INSERT INTO devices
          (
            name,
            model,
            manufacturer,
            location,
            status,
            lastServiceDate
          )
          VALUES ($1, $2, $3, $4, $5, $6)
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
      }

      console.log("Database initialized with sample medical devices.");
    }

    console.log("Connected to PostgreSQL.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

module.exports = {
  pool,
  initializeDatabase,
};