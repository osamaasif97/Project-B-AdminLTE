const User = require('../model/login')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')


const register = async (req, res) => {
    const { email, name, password: plainTextPassword } = req.body
    //errors
    if (!name || typeof name !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Name' })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)
    try {
        const response = await User.create({
            email,
            name,
            password
        })
        res.status(201).json({
            status: 'ok',
            message: "User created successfully",
            user: response
        })

    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.json({ status: 'error', error: `${Object.keys(error.keyValue)} already taken` })
        }
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid email or Password' })
    }

    if (user) {
        bcrypt.compare(password, user.password, async function (err, isMatch) {
            if (!isMatch) {
                return res.json({ status: 'error' })
            }

            if (isMatch) {
                const token = jwt.sign({
                    id: user._id,
                    name: user.name,
                }, process.env.JWT_SECRET, { expiresIn: '2h' })
                return res.json({ status: 'ok', token: token, user: user.name })
            }
        })
    } else {
        res.json({ status: 'error', user: false })
    }
}

const logout = async (req, res) => {
    try {
        res.json({ status: 'ok' })
    } catch (error) {
        console.log('/ logout error')
        res.json({ status: error, error: 'invalid token' })
    }
}

const getUser = async (req, res) => {
    const { token } = req.body
    try {
        const tokenData = jwt.decode(token)
        const id = tokenData.id
        const user = await User.findById(id)
        if (user) user.password = null
        res.status(200).json({ message: 'ok', data: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'error' })
    }
}

module.exports = {
    register,
    login,
    logout,
    getUser
}