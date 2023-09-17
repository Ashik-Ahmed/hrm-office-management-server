const { default: mongoose } = require("mongoose");
const Requisition = require("../models/Requisition");

exports.createRequisitionService = async (requisitionData) => {

    const result = await Requisition.create(requisitionData)
    console.log(result);
    return result;
}

exports.getAllRequisitionByUserEmailService = async (employeeId) => {

    const allRequisition = await Requisition.aggregate([
        {
            $match: { submittedBy: new mongoose.Types.ObjectId(employeeId) }
        },
        {
            $project: {
                department: 1,
                status: 1,
                createdAt: 1,
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

    return allRequisition;
}