const { default: mongoose } = require("mongoose");
const Requisition = require("../models/Requisition");

exports.createRequisitionService = async (requisitionData) => {

    const result = await Requisition.create(requisitionData)
    console.log(result);
    return result;
}
