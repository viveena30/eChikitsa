const express = require("express");
const app = express();
const port = process.env.PORT || 3003;
require("dotenv").config()
const conn = require("./database/conn")
const cookieParser = require("cookie-parser")
const doctorRouter = require("./routers/doctorRoutes")
const patientRouter = require("./routers/patientRoutes")
const loginRouter = require("./routers/login")

//-------------------------------------------------

// connect to db
conn();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// app.use('/api/user', userRouter)

app.use('/api/doctor', doctorRouter)

app.use('/api/patient', patientRouter)

app.use('/api/auth', loginRouter)
 
app.use('/api/*',(req, res)=>{
    res.status(404).json({error:"Not found"});
})
 
app.use('/*',(req, res)=>{
    res.status(404).json({error:"Not found"});
})

//-------------------------------------------------

app.listen(port, ()=>{
    console.log(`listening to the port ${port}`)
});