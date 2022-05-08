const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const doctormodels = require("./doctorModel");
require("dotenv").config();

//we can use [] brackets instead of array, if array doesn't give output

const patientSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    tokens: [
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
            
});

patientSchema.methods.genAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token

    }catch(err){
        console.log(err)
    }
}

const patientModel = mongoose.model('patientmodel', patientSchema);
module.exports = patientModel;