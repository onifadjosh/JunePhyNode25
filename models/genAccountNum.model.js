const mongoose = require('mongoose')

const GenAccountSchema = mongoose.Schema({
    genAccount : {
        type:Number,
        // default:20200000
    }
})

const GenAccountModel= mongoose.model('GenAccount', GenAccountSchema) 


module.exports = GenAccountModel