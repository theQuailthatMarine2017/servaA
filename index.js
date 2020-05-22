const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const Meetings = require('./meetings');
const User = require('./users');
const fs = require('fs');
var path = require('path');


const app = express()

app.use(cors());
app.use(expressip().getIpInfoMiddleware);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

const port = 7200
app.listen(port)

mongoose.connect( "mongodb://localhost:27017/QFlixsDB",
                 { useUnifiedTopology : true, useNewUrlParser: true, useCreateIndex: true },
                () => console.log(`Connection to database ${mongoose.connection.name} on ${mongoose.connection.host}:${mongoose.connection.port} status: ${mongoose.connection.readyState}`));



app.get('/api/shirikia/create-account',function(req,res) {

	const user = new User({

                    email: req.body.email,
                    mobile: req.body.email,
                    fullnames: req.body.email,
                    occupation: req.body.email,
                    password: req.body.email
        
                });
    
                const newuser = await user.save();
        
                console.log(newuser)

                res.send.json({
                	title:'Account Created',
                	newuser
                })

})