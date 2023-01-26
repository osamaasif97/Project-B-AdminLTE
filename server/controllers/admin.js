const User = require('../model/login')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Permission = require('../model/permissions')

const getUsers = async (req, res) => {
    const { token } = req.body
    try {
        const tokenData = jwt.decode(token)
        const users = await User.find()
        res.status(200).json({ message: 'ok', data: users })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}
const getUser = async (req, res) => {
    const { token } = req.body
    try {
        const tokenData = jwt.decode(token)
        const user = await User.findById(tokenData.id)
        res.status(200).json({ message: 'ok', data: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}

const changePower = async (req, res) => {
    const { token, power, id } = req.body
    try {
        const tokenData = jwt.decode(token)
        const user = await User.findById(tokenData.id)
        if (user.power !== "Super Admin" && user.power !== "admin") {
            return res.status(500).json({ status: 'error', message: 'Invalid power' })
        }
        if (user.power === "Super Admin" || user.power === "admin") {
            console.log('yo');
            const change = await User.findByIdAndUpdate(id, {
                power: power
            })
            return res.status(200).json({ status: 'ok', message: 'Updated' })
        } else {
            console.log('Invalid Error');
            return res.status(500).json({ status: 'error', message: 'Invalid' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}

const changePermissions = async (req, res) => {
    const { token, id, create, edit, Delete, activate, drag } = req.body
    try {
        const tokenData = jwt.decode(token)
        const user = await User.findById(tokenData.id)
        if (user.power !== "Super Admin" && user.power !== "admin") {
            return res.status(500).json({ status: 'error', message: 'Invalid power' })
        }
        else if (user.power === "Super Admin" || user.power === "admin") {
            const change = await User.findByIdAndUpdate(id, {
                create: create,
                edit: edit,
                delete: Delete,
                activate: activate,
                drag: drag
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}
const createPermissions = async (req, res) => {
    const { token,
        permissionName,
        permissionId,
        dashboardView,
        viewUser,
        createUser,
        editUser,
        DeleteUser,
        dragUser,
        viewAdmin,
        editAdmin } = req.body

    try {
        const result = await Permission.create({
            permissionName,
            permissionId,
            dashboardView,
            viewUser,
            createUser,
            editUser,
            DeleteUser,
            dragUser,
            viewAdmin,
            editAdmin
        })
        res.status(200).json({ status: 'ok', data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}

const getPermission = async (req, res) => {
    const { power } = req.body
    try {
        const result = await Permission.find({ "permissionName": power })
        res.status(200).json({ status: 'ok', data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }

}
const getPermissions = async (req, res) => {
    const { token } = req.body
    try {
        const result = await Permission.find()
        res.status(200).json({ status: 'ok', data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}
const updateRow = async (req, res) => {
    const { token, rowUpdate } = req.body
    const { _id, dashboardView, viewUser, createUser, editUser,
        DeleteUser, dragUser, viewAdmin, editAdmin } = rowUpdate
    try {
        const update = await Permission.findByIdAndUpdate(_id, {
            dashboardView, viewUser, createUser, editUser,
            DeleteUser, dragUser, viewAdmin, editAdmin
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}

const deleteRow = async (req, res) => {
    const { token, id } = req.body
    try {
        const result = await Permission.findByIdAndDelete(id)
        res.status(200).json({ status: 'ok', message: "Deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}


module.exports = {
    getUsers,
    getUser,
    changePower,
    changePermissions,
    createPermissions,
    getPermission,
    getPermissions,
    updateRow,
    deleteRow
}