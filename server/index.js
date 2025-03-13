const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use('/api/nft', require('./routes/nftroutes'));

mongoose.connect(process.env.MONGO_URL)
.then(
    ()=>{
        console.log("Database connected")
        app.listen(3000,()=>{
            console.log("server is running")
        })
    }
)
.catch((error)=>{
    console.log(error)
})