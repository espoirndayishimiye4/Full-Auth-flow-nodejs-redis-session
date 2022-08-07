const express = require('express')

const {register, login, activeAccount, logout} = require('../controllers/user')
const routes = express.Router()


routes.route('/').post(register)

routes.route('/login').post(login)

routes.route('/active').post(activeAccount)

module.exports = routes