const mongoose = require('mongoose')

const connectDB = (URL) => {
    mongoose.connect(URL)
        .then(() => console.log('Connected to Data Base!'))
}

module.exports = connectDB