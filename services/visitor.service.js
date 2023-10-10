const Visitor = require("../models/Visitor");


exports.createNewVisitorService = async (data) => {
    console.log(data);
    const visitor = await Visitor.create(data)

    return visitor;
}

exports.getMonthlyVisitorService = async (month, year) => {
    console.log(month, year);
    const visitors = await Visitor.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$createdAt" }, year] },
                        { $eq: [{ $month: "$createdAt" }, month] }
                    ]
                }
            }
        }
    ]);
    console.log(visitors);
    return visitors;
}