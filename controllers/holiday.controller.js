const { createHolidayService, getAllHolidayService, deleteHolidayByIdService, editHolidayByIdService } = require("../services/holiday.services")

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
        const year = req.query.year || new Date();

        const holiday = await getAllHolidayService(year);
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

exports.editHolidayById = async (req, res) => {
    try {
        const { id } = req.params;

        const holiday = await editHolidayByIdService(id, req.body);

        if (holiday?.modifiedCount > 0) {
            res.status(200).json({
                status: 'Success',
                data: holiday
            })
        }

        else {
            res.status(404).json({
                status: 'Failed',
                error: 'Failed to edit holiday'
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