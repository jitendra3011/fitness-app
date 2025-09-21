const mongoose = require('mongoose')

const colours = require('colours')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(colours.green('Connected to MongoDB'))
    } catch (error) {
        console.error(colours.red('Error connecting to MongoDB:'), error)
        process.exit(1)
    }
};

module.exports = connectDB