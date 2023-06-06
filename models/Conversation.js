const mongoose = require('mongoose')

const ConversationSchema = mongoose.Schema({
    members:{
        type:Array
    }
})

module.exports = mongoose.model('Conversation',ConversationSchema);