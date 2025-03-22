const { createHolidayService, getAllHolidayService, deleteHolidayByIdService } = require("../services/holiday.services")

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


exports.getAllHoliday = async (req, res) => {
    try {
        const holiday = await getAllHolidayService();
        if (holiday?.length > 0) {
            res.status(200).json({
                status: 'Success',
                data: holiday
            })
        }
        else {
            res.status(404).json({
                status: 'Failed',
                error: 'No holiday found'
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.deleteHolidayById = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await deleteHolidayByIdService(id);
        if (holiday?.deletedCount > 0) {
            res.status(200).json({
                status: 'Success',
                data: holiday
            })
        }
        else {
            res.status(404).json({
                status: 'Failed',
                error: 'No holiday found'
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}