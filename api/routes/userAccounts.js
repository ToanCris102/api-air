const express = require('express')
const router = express.Router()
const UserAccount = require('../models/UserAccount')
const userMiddleware = require('../middleware/userMiddleware')
const userAccountController = require('../controllers/userAccounts')

// @route GET /api/user-accounts
// @desc show list info person
// @access private role admin
router.get('/', userAccountController.getListUserAccount)


// @route GET /api/user-accounts/id
// @desc show info person
// @access private role admin
router.get('/:id', userAccountController.getUserAccount)

// ROLE USER: 6227a0855580184876a6b641
// ROLE ADMIN: 6227a0855580184876a6b643

// @route POST api/user-accounts/signup
// @desc Signup User
// @access Public
router.post('/signup',[userMiddleware.checkSignUp] , userAccountController.signUp )

// @route api/user-accounts/login
// @desc Login User
// @access Public
router.post('/login',[userMiddleware.checkLogin] , userAccountController.logIn)

// @Path api/user-accounts/update/id
// @Desc Update data for User
// @Access private role admin OR user
router.put('/update/:id' , userAccountController.updateUserAccount )

// @Path api/user-accounts/delete/id
// @Desc Delete data for User
// @Access private role admin 
router.delete('/delete/:id', userAccountController.deleteUserAccount)



module.exports = router