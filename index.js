const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Meetings = require('./meetings');
const User = require('./users');
const fs = require('fs');
var path = require('path');


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


//write function get user attended meetings
async function getMeetingsAttended(user){

	user.attendedMeetings = 0

	// Go through entire collection for Meetings and find those that are complete.

	Meetings.find({}, function(err,data) {

		if (err) return res.send(500, {err});

		//Check each Meetings collections whether it is comeplete or not by iterating through each collection
		if(data.length > 0){

			for(var meeting of data){

				//Check if meeting is complete

				if (meeting.meeting_complete === true){

					//If meeting complete is true iterate through the Mettings attendees array to see if,
					//current user email is included

					for (var attendees of meeting.attendees) {


						//Check if user email is in attendeess

					  	var attended = attendees.includes(user.email);

						if(attended === true){

							//If true increment count by 1. This is done for each Meeting items marked complete

						  	user.attendedMeetings = user.attendedMeetings + 1

					  	}

					}


				}
			}

		} else {

			return "No Meetings In Database"
		}

	});

	//Update the current user and return
	User.findOneAndUpdate({email:this.user.email},this.user, function(err,updated){

		//Update count for meetings attended
		if (err) return res.send(500, {err});

		return this.updated


	});

}


//Get All Meetings Function
async function getMeetings(user_email){

	user_meetings = []

	Meetings.find({},function(err,data) {

		if (err) return res.send(500, {err});

		if (data === null || data === []){

			return user_meetings

		}
		if(data != null){

			for (var attendee of data.attendees){

				var present  = attendee.includes(user.email);

				if(present === true){

					user_meetings.push(data)

				}


			}

			return user_meetings
		}
	})

}

// create new user account
app.post('/api/shirikia/create-account', async (req,res) => {

	var user_account = null
	var user_meetings = []

	console.log(req.body)

	try {

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
	    user_account = newuser

	    var token = jwt.sign({_id: newuser._id}, 'shikiria-pass-ke-qg-mr-ru-30005325');

	    console.log(token)

	    res.status(200).json({
	    	title:'Created',
	    	user_account,
	    	token,
	    	user_meetings

	    })



	} catch (err) {

		return res.status(500).send({
			   title: err
			});

	}

});


//login existing user account
app.post('/api/shirikia/login', async (req,res) => {

	console.log(req.body)

	var user_account = null
	var user_meetings = []

	try {


		await User.findOne({ email : req.body.email}, function(err, user) {

			if (err){

				console.log(err)

				return res.status(500).send({
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

                    // Get All Meetings From Database and Send Back
                    Meetings.find({},function(err,data) {

                    	user_meetings = data

							if (err) return res.send(500, {err});


								return res.status(200).json({
					                        title: 'success',
					                        token: token,
					                        user_account,
					                        user_meetings

					                    });

						})


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

console.log('Server is listening on port ' + port);
