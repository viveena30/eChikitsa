const express = require("express")
const router = express.Router()
const doctorModel = require("../model/doctorModel")
const patientModel = require("../model/patientModel")

router.post("/api/auth", async (req, res) => {
    
    try {

        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" })
        }

        const isDoctorExist = await doctorModel.findOne({ email, password });
        const isPatientExist = await patientModel.findOne({ email, password });

        if (isDoctorExist) {

            const token = await isDoctorExist.genAuthToken()

            res.cookie("doctorToken", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            }).status(200).json({ message: "You logged in successfully as doctor!" })

        }
        else if (isPatientExist) {

            const token = await isPatientExist.genAuthToken()

            res.cookie("patientToken", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            }).status(200).json({ message: "You logged in successfully as patient!" })

        }
        else {
            return res.status(400).json({ error: "Enter valid email or password" })
        }



        
    } catch (error) {
        console.log(error)
    }

})

module.exports = router