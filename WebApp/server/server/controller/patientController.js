const patientModel = require('../model/patientModel')
// const validateStudent = require('../../validation/studentValidation')

exports.signUp = async (req ,res) => {

    try{
        
        const name = req.body.Name;
        const email = req.body.email;
        const password = req.body.password; 

        if(!name && !email && !password ){
            return res.status(400).json({error:"Please fill all the fields"})
        }

        const isPatientExist = await patientModel.findOne({email});

        if(isPatientExist){
            return res.status(400).json({error:"Patient already exists"})
        }

        var data = new doctorModel ({ name, email, password });

        await data.save();
        res.status(200).json({messge:"you signed up successfully!"});

    }
    catch(err){
        console.log(err)
    }

}
