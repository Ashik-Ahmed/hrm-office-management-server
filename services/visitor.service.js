const Guest = require("../models/Visitor");

exports.createNewVisitorService = async (data) => {
    console.log(data);
    const visitor = await Guest.create(data)

    return visitor;
}

exports.getMonthlyVisitorService = async (month, year) => {

}