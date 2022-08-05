const User = require('../models/user')

const register = async (req, res)=>{
    const user = new User(req.body)
    const newUser = await user.save()
    res.status(201).json({
        success: true,
        data: newUser
    })
}

module.exports = {register}