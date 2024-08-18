const Page = require("../models/Page")

exports.createNewPageService = async (data) => {
    const page = await Page.create(data)
    return page
}

exports.getAllPageService = async () => {
    const page = await Page.find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
    return page
}