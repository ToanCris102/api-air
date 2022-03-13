const express = require('express')
const router = express.Router()
const InfoUser = require('../models/InfoUser')
const userMiddleware = require('../middleware/userMiddleware')
const infoUserController = require('../controllers/infoUsers')
// router temp
// @route GET api/info-users/
// @desc show list information 
// @access private role admin
router.get('/', infoUserController.getListInfoUser)


// @route GET api/info-user/id
// @desc show info person
// @access private role admin
router.get('/:id', infoUserController.getInfoUser)

// @route POST api/info-users/add
// @desc add User information
// @access private role admin
router.post('/add' , infoUserController.setInfoUser)

// @path api/info-users/update
// @desc Update User information 
// @access private role admin
router.put('/update/:id' , infoUserController.updateInfoUser)


// @Path api/users/delete/id
// @Desc Delete data for User
// @Access private
router.delete('/delete/:id',infoUserController.deleteInfoUser)

module.exports = router