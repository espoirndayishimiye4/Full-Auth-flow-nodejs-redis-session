const { v4: uuidv4 } = require("uuid");
const {BadRequest} = require('http-errors')
const { createClient } = require("redis");
const client = createClient();

const User = require('../models/user')
const {sendAccountActivationEmail} = require('../services/email')

const register = async (req, res)=>{
    const token = uuidv4()
    const isEmailExist = await User.findOne({email:req.body.email})
    if(isEmailExist) throw new BadRequest('user with this email Already Exist')
    const user = new User(req.body)
    const newUser = await user.save()
    const userData = {
        id: user._id,
        email: user.email,
      };
      await client.connect();
      await client.hSet(token, userData);
      await client.disconnect()
    await sendAccountActivationEmail(token, user)
    res.status(201).json({
        success: true,
        data: newUser
    })
}

module.exports = {register}