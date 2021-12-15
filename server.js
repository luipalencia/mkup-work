const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' })
const app = require('./app')

mongoose.connect('mongodb://localhost:27017').then(() => console.log('DB connection is sucessful'))

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App running on port')
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhadler rejection')
    process.exit(1);
})