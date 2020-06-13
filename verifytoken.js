const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    verifycode: {
    	type:Number,
        required:true
    },
    token:{
        type:String,
        required:true
    }
}, {timestamps: true});

module.exports = mongoose.model('Verify', verifySchema);