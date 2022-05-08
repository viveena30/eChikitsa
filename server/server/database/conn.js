const mongoose = require("mongoose")
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const connectDB = async () => {
    
    try{
        const conn = await mongoose.connect("mongodb+srv://jevvvin_:Jevin3008vv@cluster0.3mjpq.mongodb.net/echikitsa?retryWrites=true&w=majority",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DB connected");
    }
    catch(err){
        console.log(err);
    }

}

module.exports = connectDB