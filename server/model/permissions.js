const mongoose = require('mongoose')

const PermissionSchema = new mongoose.Schema({
    permissionName: {
        type: String,
        unique: [true, 'Name taken'],
    },
    permissionId: {
        type: Number,
        unique: true
    },
    dashboardView: {
        type: Boolean,
        default: 'false'
    },
    viewUser: {
        type: Boolean,
        default: 'false'
    },
    createUser: {
        type: Boolean,
        default: 'false'
    },
    editUser: {
        type: Boolean,
        default: 'false'
    },
    DeleteUser: {
        type: Boolean,
        default: 'false'
    },
    dragUser: {
        type: Boolean,
        default: 'false'
    },
    viewAdmin: {
        type: Boolean,
        default: 'false'
    },
    editAdmin: {
        type: Boolean,
        default: 'false'
    }

},
    { collection: 'permissions' }
)

const model = mongoose.model('PermissionSchema', PermissionSchema)

module.exports = model