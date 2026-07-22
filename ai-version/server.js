require("dotenv").config();

const express = require("express");

const initializeDatabase = require("./init");
const seedDatabase = require("./seed");

const app = express();

app.use(express.json());

app.use("/devices", require("./routes/devices"));

const PORT = process.env.PORT || 3000;

async function start(){

    try{

        await initializeDatabase();

        await seedDatabase();

        app.listen(PORT, ()=>{

            console.log(`Server running on port ${PORT}`);

        });

    }catch(err){

        console.error(err);

    }

}

start();