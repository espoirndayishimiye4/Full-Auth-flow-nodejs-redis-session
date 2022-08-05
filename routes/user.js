const express = require('express')

const {register} = require('../controllers/user')
const routes = express.Router()


routes.route('/').post(register)

module.exports = routes