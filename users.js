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
        type:string,
        required:true
    }
}, {timestamps: true});

movieSchema.plugin(uniqueValidator, {message: 'User Exists.'});

module.exports = mongoose.model('User', userSchema);