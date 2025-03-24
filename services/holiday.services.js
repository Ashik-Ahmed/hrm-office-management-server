const Holiday = require("../models/Holiday");

exports.createHolidayService = async (data) => {
    const holidayDate = new Date(data?.date); // receivedDate is from frontend
    data.date = new Date(holidayDate.getTime() + (6 * 60 * 60 * 1000)); // Convert from BST (UTC+6) to UTC

    const holiday = await Holiday.create(data)
    return holiday;
}

exports.getAllHolidayService = async (date) => {

    const receivedDate = new Date(date); // Example date from frontend
    const year = receivedDate.getFullYear(); // Extract the year

    // Convert Bangladesh Time (UTC+6) to UTC
    const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0)); // January 1st, 00:00:00 UTC
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // December 31st, 23:59:59 UTC

    const holidays = await Holiday.find({
        date: { $gte: startOfYear, $lte: endOfYear } // Query using UTC times
    })
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

exports.editHolidayByIdService = async (id, data) => {
    const result = await Holiday.updateOne({ _id: id }, data);
    return result;
}

exports.deleteHolidayByIdService = async (id) => {
    const result = await Holiday.deleteOne({ _id: id });
    return result;
}