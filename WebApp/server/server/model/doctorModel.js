const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//we can use [] brackets instead of array, if array doesn't give output

const doctorSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    registrationId:{
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

doctorSchema.methods.genAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token

    }catch(err){
        console.log(err)
    }
}

const doctorModel = mongoose.model('docotormodel', doctorSchema);
module.exports = doctorModel