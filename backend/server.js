const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()

const app=express()
app.use(cors({origin: process.env.CORS_ORIGIN || 'http://localhost:3000'}))
app.use(express.json())
app.get('/',(req,res)=>{
    res.json("Welcome to tudu app backend")
})
app.use('/api/auth',require('./routes/auth'));
app.use('/api/note',require('./routes/note'));
app.use('/api/payment', require('./routes/payments'));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{ console.log("DB Connected")})
.catch((err)=>{ console.error(err) })

app.listen(process.env.PORT,()=>{
    console.log('Welcome to tudu-backend')
});