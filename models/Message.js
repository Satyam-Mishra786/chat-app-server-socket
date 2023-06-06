const mongoose = require('mongoose')


const MessageSchema = mongoose.Schema({
    msg:{
        type:String,
        require:[true,'Please provide message']
    },
    conversationId:{
        type:String,
        require:[true, 'Please give the conversationId']
    },
    sendBy:{
        type:String,
        require:[true,'Please the sender Id']
    }
})

module.exports = mongoose.model('Message',MessageSchema);