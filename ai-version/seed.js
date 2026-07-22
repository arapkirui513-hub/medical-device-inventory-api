const pool = require("./db");

async function seedDatabase(){

    const result = await pool.query(
        "SELECT COUNT(*) FROM devices"
    );

    if(Number(result.rows[0].count) === 0){

        await pool.query(`
        INSERT INTO devices
        (name, manufacturer, model, location, status)

        VALUES

        ('ECG Machine','Philips','ECG100','ICU','Available'),

        ('Ventilator','GE','V200','ICU','In Use'),

        ('Infusion Pump','Baxter','IP300','Ward A','Available');
        `);

        console.log("Sample data inserted.");
    }

}

module.exports = seedDatabase;