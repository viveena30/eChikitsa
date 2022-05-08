const jwt = require("jsonwebtoken");
const doctorModel = require("../model/doctorModel");
const patientModel = require("../model/patientModel");

const authentication = async (req, res, next) => {
    try {
        const doctorToken = req.cookies.doctorToken;
        const patientToken = req.cookies.patientToken;

        if(doctorToken){
        
            const verifyDoctor = jwt.verify(doctorToken, process.env.SECRET_KEY);
            const rootDoctor = await doctorModel.findById({ _id: verifyDoctor._id, "tokens:token": doctorToken });

            if (!rootDoctor) {
                return res.status(401).json({ error: "Please login first" });
            }

            req.userId = rootDoctor._id;

        } else if(patientToken){

            const verifyPatient = jwt.verify(patientToken, process.env.SECRET_KEY);
            const rootPatient = await patientModel.findById({ _id: verifyPatient._id, "tokens:token": patientToken });

            if (!rootPatient) {
                return res.status(401).json({ error: "Please login first" });
            }

            req.userId = rootPatient._id;

        } else {

            return res.status(401).json({error:"Please login first"})

        }

        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Some erroe occured in authentication" });
    }
}

module.exports = authentication;