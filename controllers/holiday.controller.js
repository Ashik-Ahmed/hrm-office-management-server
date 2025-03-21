const { createHolidayService } = require("../services/holiday.services")

exports.createHoliday = async (req, res) => {
    try {
        const holiday = await createHolidayService(req.body)

        if (holiday?._id) {
            res.status(201).json({
                status: 'Success',
                data: holiday
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'Failed to create holiday'
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}