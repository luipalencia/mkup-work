const fs = require('fs')

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/users.json`));

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not defined'
    })
}
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not defined'
    })
}
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not defined'
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not defined'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not defined'
    })
}
