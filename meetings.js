const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const meetingsSchema = new mongoose.Schema({

    title: {
        type:String,
        required:true,
        unique:true
    },
    createdby:{
        type:String,
        required:true
    },
    start_time: {
        type:Date,
        required:true
    },
    attendees:{
        type:Array,
        required:true
    },
    passcode:{
        type:String,
        required:true
    }

}, {timestamps: true});

meetingsSchema.plugin(uniqueValidator, {message: 'Meeting Scheduled. Change Title'});

module.exports = mongoose.model('Meetings', meetingsSchema);