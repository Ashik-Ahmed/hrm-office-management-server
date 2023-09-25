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
            $project: {
                department: 1,
                status: 1,
                createdAt: 1,
                itemList: 1,
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