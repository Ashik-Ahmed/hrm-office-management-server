const Holiday = require("../models/Holiday");

exports.createHolidayService = async (data) => {
    const holiday = await Holiday.create(data)
    return holiday;
}