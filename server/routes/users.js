const express = require('express')
const router = express.Router()

const users = require('../controllers/users')

router.route("/all").get(users.getAllUsers)
router.route("/find").get(users.getUser)
router.route("/").post(users.createUser)
router.route("/edit").patch(users.editUser)
router.route("/delete").delete(users.deleteUser)
router.route("/bulkdelete").delete(users.BulkdeleteUsers)
router.route("/activeStatus").patch(users.activeStatus)
router.route("/inactiveStatus").patch(users.inactiveStatus)
router.route("/changePositon").patch(users.changePositon)

module.exports = router