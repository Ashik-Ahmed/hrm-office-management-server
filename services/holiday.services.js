const Holiday = require("../models/Holiday");

exports.createHolidayService = async (data) => {
    const holiday = await Holiday.create(data)
    return holiday;
}

exports.getAllHolidayService = async () => {
    const holidays = await Holiday.find({})
        .populate({
            path: "createdBy",
            select: { _id: 0, firstName: 1, lastName: 1 }, // Select only firstName & lastName
        })
        .populate({
            path: "updatedBy",
            select: { _id: 0, firstName: 1, lastName: 1 }, // Select only firstName & lastName
        })
        .sort({ date: 1 })
        .lean(); // Convert Mongoose documents to plain objects

    // Merge firstName & lastName into createdBy field
    holidays.forEach(holiday => {
        if (holiday.createdBy) {
            holiday.createdBy = `${holiday.createdBy.firstName} ${holiday.createdBy.lastName}`;
        }

        if (holiday.updatedBy) {
            holiday.updatedBy = `${holiday.updatedBy.firstName} ${holiday.updatedBy.lastName}`;
        }
    });

    return holidays;
}

exports.deleteHolidayByIdService = async (id) => {
    const result = await Holiday.deleteOne({ _id: id });
    return result;
}