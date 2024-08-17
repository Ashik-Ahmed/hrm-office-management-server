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
        },
        {
            $project: {
                _id: 0,
                createdAt: 1,
                // createdAt: {
                //     $dateToString: {
                //         format: "%Y-%m-%d", // Format as YYYY-MM-DD
                //         date: "$createdAt",
                //         // timezone: "UTC" // Assuming your dates are in UTC
                //     }
                // },
                name: 1,
                mobile: 1,
                company: 1,
                designation: 1,
                purpose: 1,
                entryTime: 1
            }
        }
    ]);
    // console.log(visitors);
    return visitors;
}