const Percentage = require('../models/Percentage')

const getPercentage = async(req, res) => {
    await Percentage
            .find({})
            .sort({createAt:-1})  
            .then(result => {                
                res
                    .status(200)
                    .json(result[0])
            })
}

const setPercentage = async (req, res) => {
    const {tax, business} = req.body.percentage
    const percentage = new Percentage({
        tax: tax,
        business: business
    })
    await percentage.save()
    res.json({
        success: true,
        percentage: percentage
    })
}

module.exports = {
    getPercentage,
    setPercentage
}