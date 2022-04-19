const express = require('express')
const router = express.Router()
const percentageController = require('../controllers/percentage')

router.get('/', percentageController.getPercentage)

router.post('/set', percentageController.setPercentage)

module.exports = router