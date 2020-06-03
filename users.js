const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: {
    	type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    fullnames: {
    	type:String,
    	required:true
    },
    occupation:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    attendedMeetings:{
        type:Number,
        default:0
    }
}, {timestamps: true});

userSchema.plugin(uniqueValidator, {message: 'User Exists.'});

module.exports = mongoose.model('User', userSchema);