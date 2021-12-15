const express = require('express');
const router = express.Router();
const usersController = require('./../controllers/usersController')
const authController = require('./../controllers/authController')

router
    .post('/signup', authController.signup)

router
    .post('/login', authController.login)

router
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)

router.route('/:id')
    .get(usersController.getUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router;