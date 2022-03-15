const UserFlightInfo = require('../models/UserFlightInfo')

const getListUserFlightInfo = async(req, res) => {
    await UserFlightInfo
        .find({})
        .then(result => {
            res
                .status(200)
                .json(result)
        })
}

module.exports = {
    getListUserFlightInfo
}