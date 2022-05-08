const express = require("express")
const doctorRoute = express.Router()
const doctorController = require("../controller/doctorController")
const authentication = require("../middleware/authentication")

doctorRoute.post("/api/doctor" , doctorController.signUp);

doctorRoute.get("/", authentication, doctorController.getAllDoctors);
 
doctorRoute.use('/*',(req, res)=>{
    res.status(404).json({error:"Not found"});
})

module.exports = doctorRoute;

