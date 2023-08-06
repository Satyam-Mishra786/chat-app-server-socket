const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const login =  async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) return res.status(StatusCodes.BAD_REQUEST).json({success:false, msg:'Please provide Credentials'})    

    const user = await User.findOne({email})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({success:false, msg:'Invalid Credentials'})
    }

    const isCorrectPass = await bcrypt.compare(password, user.password)
    if(!isCorrectPass){
        return res.status(StatusCodes.BAD_REQUEST).json({success:false, msg:'Invalid Credentials'})
    }
    const token = user.createJWT()

    const {username, _id} = user;
    res.status(StatusCodes.OK).json({success:true, msg:'Login Successful', token, user:{
        username,userId:_id
    }})
}


const register = async(req, res)=>{
    const {username, email, password} = req.body;
    console.log(username)

    if (!username || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: `Please provide all the details` })
    }
    try {
        const salt = bcrypt.genSaltSync();
        const hashPass = bcrypt.hashSync(password, salt)
        const user = await User.create({ username, email, password: hashPass })
        const token = user.createJWT()
        res.status(StatusCodes.CREATED).json({ success: true, user, msg: `User created Successfully`, token })
    } catch (e) {
        return res.status(500).json({ success: false, msg: 'Error creating user..' })
    }

}

module.exports = {
    login, 
    register
}