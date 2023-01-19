const User = require('../model/users')

exports.getAllUsers = async (req, res, next) => {
    try {
        const [users, _] = await User.findAll()
        res.json({ status: 'ok', data: users })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
exports.getUser = async (req, res, next) => {
    try {
        const { id } = req.query
        if (id) {
            const [user, _] = await User.findbyId(id)
            res.json({ status: 'ok', data: user })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const max_position = await User.getMaxPosition()
        let { first_name, last_name, email, address, status, profile_pic, bio } = req.body
        let user = new User(first_name, last_name, email, address, status, profile_pic, bio, max_position)
        user = await user.save()
        // res.status(201).json({ status: 'ok', data: user })
        res.json({ status: 'ok', data: user })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.editUser = async (req, res, next) => {
    try {
        let { id, first_name, last_name, email, address, status, profile_pic, bio } = req.body
        // console.log(req.body);
        let user = new User(first_name, last_name, email, address, status, profile_pic, bio)
        user = await user.update(id)
        res.status(201).json({ status: 'ok', data: user })
        // res.json({ status: 'ok', data: user })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.deleteUser = async (req, res) => {
    let { id } = req.query
    try {
        const user = await User.deleteOne(id)
        res.status(201).json({ status: 'ok', message: 'User Deleted' })
    } catch (error) {
        console.log(error)
    }
}

exports.BulkdeleteUsers = async (req, res) => {
    let { DATA } = req.body
    try {
        for (let i = 0; i < DATA.length; i++) {
            const user = await User.deleteBulk(DATA[i].id)
        }
        res.status(201).json({ status: 'ok', message: 'Users Deleted' })
    } catch (error) {
        console.log(error)
    }
}

exports.activeStatus = async (req, res) => {
    const { Data } = req.body
    if (Array.isArray(Data)) {
        try {
            for (let i = 0; i < Data.length; i++) {
                try {
                    const user = await User.Active(Data[i].id)
                } catch (error) {
                    console.log('/ Active Status error', error)
                    res.json({ status: error, error: 'ERROR' })
                }
            }
            res.status(201).json({ status: 'ok', message: 'Updated' })
        } catch (error) {
            console.log(error)
        }
    }
    else {
        try {
            const user = await User.Active(Data.id)
            res.status(201).json({ status: 'ok', message: 'Updated' })
        } catch (error) {
            console.log('/ Active Status error', error)
            res.json({ status: error, error: 'ERROR' })
        }
    }
}

exports.inactiveStatus = async (req, res) => {
    const { Data } = req.body
    if (Array.isArray(Data)) {
        try {
            for (let i = 0; i < Data.length; i++) {
                try {
                    const user = await User.Inactive(Data[i].id)
                } catch (error) {
                    console.log('/ InActive Status error', error)
                    res.json({ status: error, error: 'ERROR' })
                }
            }
            res.status(201).json({ status: 'ok', message: 'Updated' })
        } catch (error) {
            console.log(error)
        }
    }
    else {
        try {
            const user = await User.Inactive(Data.id)
            res.status(201).json({ status: 'ok', message: 'Updated' })
        } catch (error) {
            console.log('/ InActive Status error', error)
            res.json({ status: error, error: 'ERROR' })
        }
    }
}

exports.changePositon = async (req, res) => {
    let { startIndex, endIndex, row1, row2 } = req.body
    startIndex = startIndex + 1
    endIndex = endIndex + 1
    // console.log("startIndex", startIndex, "endIndex", endIndex,
    //     "row1 ID", row1, "row2 ID", row2)
    try {
        if (startIndex + 1 === endIndex || startIndex - 1 === endIndex) {
            const swap1 = await User.swap2(startIndex, endIndex)
        }
        else if (startIndex < endIndex) {
            const swap = await User.reorderTtoB(startIndex, endIndex)
        }
        else {
            const swap = await User.reorderBtoT(startIndex, endIndex)
        }

        // if (swap1 && swap2) res.status(201).json({ status: 'ok', message: 'Updated' })
    } catch (error) {
        console.log(error)
    }
}
