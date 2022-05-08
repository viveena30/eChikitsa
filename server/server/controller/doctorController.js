const doctorModel = require('../model/doctorModel')
// const validateStudent = require('../../validation/studentValidation')

exports.signUp = async (req ,res) => {

    try{
        
        const name = req.body.Name;
        const email = req.body.email;
        const password = req.body.password; 
        const registrationId = req.body.registrationId;

        if(!name && !email && !password && !registrationId){
            return res.status(400).json({error:"Please fill all the fields"})
        }

        const isDoctorExist = await doctorModel.findOne({ $or : [{email:email},{registrationId:registrationId}]});

        if(isDoctorExist){
            return res.status(400).json({error:"Doctor already exists"})
        }

        var data = new doctorModel ({ name, email, password, registrationId });

        await data.save();
        res.status(200).json({messge:"you signed up successfully!"});

    }
    catch(err){
        console.log(err)
    }

}

exports.getAllDoctors = async (req ,res) => {
    
        try{
            console.log("hi");
            const doctors = await doctorModel.find({_id:req.userId});
            res.status(200).json({doctors});
        }
        catch(err){
            console.log(err)        
        }
}
