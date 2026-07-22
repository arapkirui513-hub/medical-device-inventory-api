const express = require("express");
const router = express.Router();

const pool = require("../db");


// GET ALL

router.get("/", async(req,res)=>{

    const result = await pool.query(
        "SELECT * FROM devices ORDER BY id"
    );

    res.json(result.rows);

});


// GET ONE

router.get("/:id", async(req,res)=>{

    const result = await pool.query(

        "SELECT * FROM devices WHERE id=$1",

        [req.params.id]
    );

    if(result.rows.length===0){

        return res.status(404).json({
            message:"Device not found"
        });

    }

    res.json(result.rows[0]);

});


// CREATE

router.post("/", async(req,res)=>{

    const {
        name,
        manufacturer,
        model,
        location,
        status
    } = req.body;

    const result = await pool.query(

`INSERT INTO devices
(name,manufacturer,model,location,status)

VALUES($1,$2,$3,$4,$5)

RETURNING *`,

[
name,
manufacturer,
model,
location,
status
]);

res.status(201).json(result.rows[0]);

});


// UPDATE

router.put("/:id", async(req,res)=>{

const {
name,
manufacturer,
model,
location,
status
}=req.body;

const result = await pool.query(

`UPDATE devices

SET

name=$1,

manufacturer=$2,

model=$3,

location=$4,

status=$5

WHERE id=$6

RETURNING *`,

[
name,
manufacturer,
model,
location,
status,
req.params.id
]);

if(result.rows.length===0){

return res.status(404).json({
message:"Not found"
});

}

res.json(result.rows[0]);

});


// DELETE

router.delete("/:id", async(req,res)=>{

const result=await pool.query(

"DELETE FROM devices WHERE id=$1 RETURNING *",

[req.params.id]

);

if(result.rows.length===0){

return res.status(404).json({
message:"Not found"
});

}

res.json({
message:"Deleted successfully"
});

});

module.exports=router;
