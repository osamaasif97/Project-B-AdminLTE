const User = require('../model/login')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

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

const changePower = async (req, res) => {
    const { token, power, id } = req.body
    try {
        const tokenData = jwt.decode(token)
        const user = await User.findById(tokenData.id)
        if (power !== "super-admin" && power !== "admin" && power !== "basic") {
            return res.status(500).json({ status: 'error', message: 'Invalid power' })
        }
        if (user.power === "super-admin" || user.power === "admin") {
            const change = await User.findByIdAndUpdate(id, {
                power: power
            })
            return res.status(200).json({ status: 'ok', message: 'Updated' })
        } else {
            return res.status(500).json({ status: 'error', message: 'Invalid' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}

module.exports = {
    getUsers,
    changePower
}