const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' })
const fs = require('fs');
const Tour = require('./../models/tourModel');

mongoose.connect('mongodb://localhost:27017').then(() => console.log('DB connection is sucessful'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'))

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('successfully done')
        process.exit()
    } catch (error) {
        console.log(err)
    }
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('successfully deleted')
        process.exit()
    } catch (error) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
