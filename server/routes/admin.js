const express = require('express')
const router = express.Router()

const { getUsers, getUser, changePower, changePermissions,
    createPermissions, getPermission, getPermissions, updateRow, deleteRow } = require('../controllers/admin')

router.post('/', getUsers)
router.post('/user', getUser)
router.post('/change-power', changePower)
router.patch('/permissions', changePermissions)
router.post('/create-permission', createPermissions)
router.post('/get-permissions', getPermissions)
router.post('/getPermissions', getPermission)
router.patch('/update', updateRow)
router.delete('/deleteRow', deleteRow)


module.exports = router