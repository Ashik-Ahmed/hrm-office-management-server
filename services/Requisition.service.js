const { default: mongoose } = require("mongoose");
const Requisition = require("../models/Requisition");

exports.createRequisitionService = async (requisitionData) => {

    const result = await Requisition.create(requisitionData)
    console.log(result);
    return result;
}

exports.getRequisitionDetailsByIdService = async (requisitionId) => {
    console.log(requisitionId);
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
                totalApprovedItems: {
                    $sum: "$itemList.approvedQuantity"
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
                finalAmount: {
                    $sum: {
                        $map: {
                            input: "$itemList",
                            as: "item",
                            in: { $multiply: ["$$item.approvedQuantity", "$$item.unitPrice"] }
                        }
                    }
                }
            }
        }
    ])

    return requisitionDetails;
}