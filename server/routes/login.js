const express = require('express')
const router = express.Router()

const { register, login, logout, getUser } = require('../controllers/login')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/info', getUser)

module.exports = router