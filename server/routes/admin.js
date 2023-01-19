const express = require('express')
const router = express.Router()

const { getUsers, changePower } = require('../controllers/admin')

router.post('/', getUsers)
router.post('/change-power', changePower)

module.exports = router