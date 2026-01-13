const mongoose = require("mongoose");
const ContactEnquiry = require("../../model/ContactEnquiry");

const getAllContactEnquiries = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            startingDate,
            endingDate,
        } = req.query;

        const skip = (page - 1) * limit;

        let filter = {};

        if (search) {
            const searchRegex = search
                .split(" ")
                .map((word) => `(?=.*${word})`) // Match all words
                .join(""); // Combine into a single regex
            filter.$or = [
                { name: { $regex: searchRegex, $options: "i" } },
                { mobileNumber: { $regex: searchRegex, $options: "i" } },
                { email: { $regex: searchRegex, $options: "i" } },
            ];
        }

        if (startingDate) {
            const date = new Date(startingDate);
            filter.createdAt = { $gte: date };
        }
        if (endingDate) {
            const date = new Date(endingDate);
            filter.createdAt = { ...filter.createdAt, $lte: date };
        }

        const enquiries = await ContactEnquiry.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalAvailableEnquiries = await ContactEnquiry.countDocuments(filter);

        res.status(200).json({
            success: true,
            enquiries,
            totalAvailableEnquiries,
        });

        
    } catch (error) {
        console.error("Error fetching contact enquiries:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getContactEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const enquiry = await ContactEnquiry.findById(id);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.status(200).json({ success: true, enquiry });
    } catch (error) {
        console.error("Error fetching contact enquiry:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteContactEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const enquiry = await ContactEnquiry.findByIdAndDelete(id);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact enquiry:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Placeholder for pending enquiries as the current model doesn't have status/followUps
const getPendingContactEnquiries = async (req, res) => {
    try {
        // Since ContactEnquiry doesn't have 'followUps' or 'status' yet, 
        // we'll reuse the getAll logic or return all as pending for now.
        // If :id (dealerId) is passed, we can't filter by it yet as the model lacks dealerId.

        // Use getAllContactEnquiries logic but maybe we should warn or just return all.
        // For now, delegating to getAll logic:
        return getAllContactEnquiries(req, res);
    } catch (error) {
        console.error("Error fetching pending contact enquiries:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    getAllContactEnquiries,
    getContactEnquiryById,
    deleteContactEnquiry,
    getPendingContactEnquiries
};
