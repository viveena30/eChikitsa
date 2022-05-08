const express = require("express")
const patientRoute = express.Router()
const patientController = require("../controller/patientController")


patientRoute.post("/api/patient" , patientController.signUp);
 
patientRoute.use('/*',(req, res)=>{
    res.status(404).json({error:"Not found"});
})

module.exports = patientRoute;

