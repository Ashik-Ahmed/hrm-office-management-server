const { default: mongoose } = require("mongoose");
const Requisition = require("../models/Requisition");

exports.createRequisitionService = async (requisitionData) => {

    const result = await Requisition.create(requisitionData)
    // console.log(result);
    return result;
}

exports.getRequisitionDetailsByIdService = async (requisitionId) => {
    // console.log(requisitionId);
    const requisitionDetails = await Requisition.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(requisitionId) }
        },
        {
            $lookup: {
                from: "employees", // The name of the collection to join with
                localField: "submittedBy", // The field in the "orders" collection
                foreignField: "_id", // The field in the "customers" collection
                as: "employeeInfo" // The alias for the merged data
            }
        },
        {
            $project: {
                department: 1,
                status: 1,
                createdAt: 1,
                purchasedAmount: 1,
                purchasedItems: 1,
                itemList: 1,
                submittedBy: {
                    name: {
                        $concat: [
                            { $arrayElemAt: ["$employeeInfo.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$employeeInfo.lastName", 0] }
                        ]
                    },
                    designation: { $arrayElemAt: ["$employeeInfo.designation", 0] },
                },
                totalProposedItems: {
                    $sum: "$itemList.proposedQuantity"
                },
                proposedAmount: {
                    $sum: {
                        $map: {
                            input: "$itemList",
                            as: "item",
                            in: { $multiply: ["$$item.proposedQuantity", "$$item.unitPrice"] }
                        }
                    }
                },
                itemList: {
                    $map: {
                        input: "$itemList",
                        as: "item",
                        in: {
                            $mergeObjects: [
                                "$$item",
                                {
                                    total: {
                                        $multiply: ["$$item.unitPrice", "$$item.proposedQuantity"]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    ])

    return requisitionDetails[0];
}

exports.getMonthlyRequisitionDataService = async (query) => {

    const month = parseInt(query.month || (new Date().getMonth() + 1))
    const year = parseInt(query.year || new Date().getFullYear())

    const monthlyRequisitionData = await Requisition.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(year, month - 1, 1), // Start of the month
                    $lt: new Date(year, month, 1), // Start of the next month
                },
            }
        },
        {
            $project: {
                department: 1,
                status: 1,
                createdAt: {
                    $dateToString: {
                        format: "%Y-%m-%d", // Format as YYYY-MM-DD
                        date: "$createdAt",
                        // timezone: "UTC" // Assuming your dates are in UTC
                    }
                },
                purchasedAmount: 1,
                purchasedItems: 1,
                proposedItems: {
                    $sum: "$itemList.proposedQuantity"
                },
                proposedAmount: {
                    $sum: {
                        $map: {
                            input: "$itemList",
                            as: "item",
                            in: { $multiply: ["$$item.proposedQuantity", "$$item.unitPrice"] }
                        }
                    }
                },
            }
        },
        {
            $group: {
                _id: null, // Group all documents into a single group
                totalProposedAmount: {
                    $sum: "$proposedAmount" // Calculate the sum of all proposedAmount values
                },
                requisitions: {
                    $push: "$$ROOT" // Preserve the original documents in the group
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalProposedAmount: 1,
                requisitions: 1,
                numberOfCompletedRequisition: {
                    $size: {
                        $filter: {
                            input: "$requisitions",
                            as: "requisition",
                            cond: { $eq: ["$$requisition.status", "Completed"] }
                        }
                    }
                },
                totalPurchasedAmount: {
                    $sum: "$requisitions.purchasedAmount"
                },
                totalPurchasedItems: {
                    $sum: "$requisitions.purchasedItems"
                },
                totalProposedItems: {
                    $sum: "$requisitions.proposedItems"
                },
                totalRequisitions: {
                    $size: "$requisitions"
                },
                totalProposedItems: {
                    $sum: "$requisitions.proposedItems"
                }
            }
        }
    ]);
    // console.log(monthlyRequisitionData);

    return monthlyRequisitionData[0];
}

exports.completePurchaseByIdSevice = async (requisitionId, data) => {

    data.status = "Completed"
    data.purchasedAmount = Number(data.purchasedAmount)
    data.purchasedItems = Number(data.purchasedItems)
    // console.log(requisitionId, data);

    const result = await Requisition.updateOne(
        {
            _id: requisitionId
        },
        {
            $set: data
        },
    )

    return result;
}

exports.cancelRequisitionByIdService = async (requisitionId) => {
    const result = await Requisition.updateOne(
        {
            _id: requisitionId
        },
        {
            $set: {
                status: "Cancelled"
            }
        }
    )
    return result;
}

exports.deleteRequisitionByIdService = async (requisitionId) => {
    const result = await Requisition.deleteOne({ _id: requisitionId })
    // console.log(result);
    return result
}