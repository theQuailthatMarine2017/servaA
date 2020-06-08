const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    verifycode: {
    	type:Int,
        required:true
    },
    token:{
        type:String,
        default:false
    }
}, {timestamps: true});

module.exports = mongoose.model('Verify', verifySchema);