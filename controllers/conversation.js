const Conversation = require('../models/Conversation');
const User = require('../models/User');

const getConversation = async(req, res)=>{
    const userId = req.params.userId
    const conversations = await Conversation.find({members:{$in:userId}})

    let friends = []
    for (let i of conversations){
        
        let otherId = i.members.find((e)=>e !== userId)
        let conversationId = i._id;
        let frndUser = await User.findById(otherId);
        // console.log(frndUser)
        if (!frndUser) continue

        friends.push({conversationId, friendId:otherId, name:frndUser.username})
    }
    // console.log(friends)
    //TODO: Fetch Friends data like name and photo to send to use on frontend

    res.status(200).json({friends})
}

const startConversation = async(req, res)=>{
    const{senderId, receiverEmail} = req.body;
    const receiver = await User.findOne({email:receiverEmail})
    if(!receiver){
        return res.status(404).json({ success: false, msg: 'User not found' })
    }

    const receiverId = (receiver._id).toString();
    // console.log(receiverId)

    let members = [senderId, receiverId]

    const isConversation1 = await Conversation.findOne({members})
    const isConversation2 = await Conversation.findOne({members:[receiverId,senderId]})
    if(isConversation1 || isConversation2){
        return res.status(400).json({success:false, msg:'Conversation already exist'})
    }
    let newConversation =  await Conversation.create({members})
    newConversation = newConversation._doc

    return res.status(200).json({success:true, ...newConversation});
}

module.exports = {
    getConversation,
    startConversation
}