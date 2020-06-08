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
        required:true,
        unique:true
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
    verified:{
        type:Boolean,
        default:false
    }
}, {timestamps: true});

userSchema.plugin(uniqueValidator, {message: 'User Exists.'});

module.exports = mongoose.model('User', userSchema);