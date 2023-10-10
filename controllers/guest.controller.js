const { createNewGuestService } = require("../services/guest.service");

exports.createNewGuest = async (req, res) => {
    try {
        const guestData = req.body;

        const guest = await createNewGuestService(guestData)

        if (guest._id) {
            res.status(200).json({
                status: "Success",
                data: guest
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to insert into DB"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        })
    }
}