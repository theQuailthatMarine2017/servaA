const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const meetingsSchema = new mongoose.Schema({

    title: {
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    attendees:{
        type:Array,
        required:true
    },
    passkey:{
        type:String,
        required:true
    }

}, {timestamps: true});

movieSchema.plugin(uniqueValidator, {message: 'Meeting Scheduled. Change Title'});

module.exports = mongoose.model('User', userSchema);