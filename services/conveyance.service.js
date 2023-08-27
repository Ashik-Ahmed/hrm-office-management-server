const Conveyance = require("../models/Conveyance");
const Employee = require("../models/Employee");

exports.createConveyanceService = async (conveyanceData) => {
    // console.log(conveyanceData);

    const result = await Conveyance.create(conveyanceData);

    if (result._id) {

        const { _id: conveyanceId, employee } = result;

        // update Employee profile with conveyyance id 
        const res = await Employee.updateOne(
            { _id: employee.employeeId },
            { $push: { conveyance: conveyanceId } }
        )
        if (res.modifiedCount > 0) {
            return result;
        }
        else {
            // delete the conveyance if not modified in the employee profile 
            const deleteConveyance = await Conveyance.deleteOne({ _id: conveyanceId })
            return "Insert failed. Try again."
        }
    }
    else {
        return "Error Occurred"
    }
}