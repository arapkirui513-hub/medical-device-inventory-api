const pool = require("./db");

async function initializeDatabase() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS devices(

            id SERIAL PRIMARY KEY,

            name VARCHAR(100) NOT NULL,

            manufacturer VARCHAR(100),

            model VARCHAR(100),

            location VARCHAR(100),

            status VARCHAR(30),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

}

module.exports = initializeDatabase;