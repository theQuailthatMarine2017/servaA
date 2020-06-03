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
    start_now:{
        type:Boolean,
        default:false
    },
    mobile:{
        type:String,
        required:true
    },

    start_time: {
        type:Date,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    attendees:{
        type:Array,
        required:true
    },
    passcode:{
        type:String,
        required:true
    },
    meetingPaused:{
        type:Boolean
    },
    timePaused:{
        type:Date
    },
    meeting_complete:{
        type:Boolean,
        default:false
    }

}, {timestamps: true});

meetingsSchema.plugin(uniqueValidator, {message: 'Meeting Scheduled. Change Title'});

module.exports = mongoose.model('Meetings', meetingsSchema);