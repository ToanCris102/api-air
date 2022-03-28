
const getObjectId = async (model, a, b) => {
    const c = await model.findOne({a: b})
    return c._id
}
module.exports = {
    getObjectId
}