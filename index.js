const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Meetings = require('./meetings');
const VerifyToken = require('./verifytoken');
const User = require('./users');
const fs = require('fs');
var path = require('path');
var randomize = require('randomatic');
var ms = require('ms');
const Nexmo = require('nexmo');


const app = express();

app.use(cors());

app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();


});

app.use(express.json());

const port = 7200;
app.listen(port);

mongoose.connect( "mongodb://localhost:27017/ShirikiaDB",
                 { useUnifiedTopology : true, useNewUrlParser: true, useCreateIndex: true },
                () => console.log(`Connection to database ${mongoose.connection.name} on ${mongoose.connection.host}:${mongoose.connection.port} status: ${mongoose.connection.readyState}`));

// create new user account
app.post('/api/shirikia/create-account', async (req,res) => {

	var account_create = req.body

	//Generate Random Verification Code
	var verifycode = randomize('0', 5);
	var expireTime = ms('1m');

	//Create token and Store Verfication Code with try catch block
	try {

		var verifytoken = jwt.sign( {action: 'verify'}, 'shikiria-verify-acc',{ expiresIn: expireTime });

		var salt = bcrypt.genSaltSync(10);
		var hashed_verifycode = bcrypt.hashSync(verifycode, salt);

		const verify_store = new VerifyToken({
			verifycode: hashed_verifycode,
			token: verifytoken
		});

		const verify_account = await verify_store.save();

		console.log(verify_account)

		// send verification sms to mobile. Notify user code expires in 1m
		const nexmo = new Nexmo({

			apiKey: 'c135ac77',
			apiSecret: 'pz1EmbdzUBcsjmeO',

		});

		
		const from = 'SHIRIKIA-Verify Account';
		const to = req.body.mobile;
		const text = verifycode;
		
		nexmo.message.sendSms(from, to, text);

		//If SMS successful send account to be created back to frontend
		res.status(200).json({
	    	account_create
	    })

	} catch(error){

	     res.status(500).send({
			title: error
		 });

	}

});

//complete verify user account two step auth
app.post('/api/shirikia/verify-account/', async(req,res) => {

	//Get Verification code submited by user. Verify token also passed with user account details
	console.log(req.body)

	var verify_code = req.body.verifycode;
	var user_meetings = [];


	try{

			//Check if verification code matches any in database
			await VerifyToken.findOne({verifycode:verify_code}, function(err,passcode){

				if(err){
					res.status(500).send({
						title: err
					});
				}

				if(!passcode) return res.status(500).json({
					title:"Token Not Found"
				})

			//Passcode found, verify the jwtoken has not expired
			jwt.verify(passcode.token , 'shikiria-verify-acc', function(err, decoded) {

					if(err){

						if(err.name === 'TokenExpiredError'){

							return res.status(500).send({
								title: "Token Expired"
							});

						}

					}

					//If not expired check action is verify and create the user account and store in database
					if(decoded.action === 'verify'){

						var salt = bcrypt.genSaltSync(10);
						var hashedPassword = bcrypt.hashSync(req.body.password, salt);

						const user = new User({

							email: req.body.email,
							mobile: req.body.mobile,
							fullnames: req.body.fullnames,
							occupation: req.body.occupation,
							password: hashedPassword
						
						});

						const newuser = await user.save();

						console.log(newuser)

						var token = jwt.sign({_id: newuser._id}, 'shikiria-pass-ke-qg-mr-ru-30005325');

						console.log(token)

						res.status(200).json({
							title:'Created',
							newuser,
							token,
							user_meetings

						})

					}



				})

			})


	} catch(error){

	}


})


//login existing user account
app.post('/api/shirikia/login', async (req,res) => {

	console.log(req.body)

	var user_account = null
	var user_meetings = []

	try {


		await User.findOne({ email : req.body.email}, function(err, user) {

			if (err){

				console.log(err)

				res.status(500).send({
					   title: err
					});
			}

			if(!user) return res.status(500).json({
				title:"User Does Not Exist. Change Email"
			})

			console.log(user)

			//Verify if password submitted matches one encrypted in database for user account

            bcrypt.compare(req.body.password, user.password, function(err, resolve) {
                // res === true

                if (resolve === true) {


                    var token = jwt.sign({_id: user._id}, 'shikiria-pass-ke-qg-mr-ru-30005325');

                    console.log(token)

                    user_account = user

                    return res.status(200).json({
					                        title: 'success',
					                        token: token,
					                        user_account

					                    });


                }

                if (resolve === false) {

                    
                    return res.status(500).json({
						   title: "Passwords Do Not Match"
						});


                }

                if (err) {

                    return res.status(500).send({
					   title: err
					});

                }


            });

		});



	} catch (err) {

		return res.status(500).send({
					   title: err
					});

	}

});

//get meetings for user
app.get('/api/shirikia/get-meetings/', async(req,res) => {

	console.log(req.query)

	var meetings = null

	Meetings.find({},function(err,data) {

		if(err){
			console.log(err)

			return res.status(500).send({
				   title: err
				});

			}
			meetings = data
			
			res.status(200).send({
				meetings
			})

	});


});

console.log('Server is listening on port ' + port);
