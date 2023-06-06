const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getMessages =async (req, res)=>{
    const conversationId = req.params.conversationId;

    const messages = await Message.find({conversationId}) 

    res.send({messages})

}

const newMessage = async (req, res)=>{
    const conversationId = req.body.conversationId;
    const senderId = req.body.senderId;
    const msg = req.body.msg;

    const isConversation = await  Conversation.findById(conversationId)
    // console.log(isConversation)
    if(!isConversation){
        return res.status(400).json({success:false, msg:`The Conversation doesn't exist`})
    }

    if(!isConversation.members.includes(senderId)){
        return res.status(403).json({success:false, msg:'You are not part of that conversation'})
    }

    const message = await Message.create({conversationId,sendBy:senderId,msg})

    res.status(200).json({message})
}

module.exports = {
    getMessages,
    newMessage
}