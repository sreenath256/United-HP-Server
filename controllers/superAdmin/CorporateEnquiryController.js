const CorporateEnquiry = require("../../model/corporateEnquiry");
const mongoose = require("mongoose");

const getAllCorporateEnquiries = async (req, res) => {
    try {
        const {
            search,
            district,
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
                { institutionName: { $regex: searchRegex, $options: "i" } },
                { contactPerson: { $regex: searchRegex, $options: "i" } },
                { mobileNumber: { $regex: searchRegex, $options: "i" } },
                { email: { $regex: searchRegex, $options: "i" } },
                { district: { $regex: searchRegex, $options: "i" } },
            ];
        }

        if (district) {
            filter.district = district;
        }

        if (startingDate) {
            const date = new Date(startingDate);
            filter.createdAt = { $gte: date };
        }
        if (endingDate) {
            const date = new Date(endingDate);
            filter.createdAt = { ...filter.createdAt, $lte: date };
        }

        const enquiries = await CorporateEnquiry.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalAvailableEnquiries = await CorporateEnquiry.countDocuments(filter);

        res.status(200).json({
            success: true,
            enquiries,
            totalAvailableEnquiries,
        });

        
    } catch (error) {
        console.error("Error fetching corporate enquiries:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getCorporateEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const enquiry = await CorporateEnquiry.findById(id);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.status(200).json({ success: true, enquiry });
    } catch (error) {
        console.error("Error fetching corporate enquiry:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteCorporateEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const enquiry = await CorporateEnquiry.findByIdAndDelete(id);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
    } catch (error) {
        console.error("Error deleting corporate enquiry:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Placeholder for pending enquiries as the current model doesn't have status/followUps
const getPendingCorporateEnquiries = async (req, res) => {
    try {
        // Since CorporateEnquiry doesn't have 'followUps' or 'status' yet, 
        // we'll reuse the getAll logic or return all as pending for now.
        // If :id (dealerId) is passed, we can't filter by it yet as the model lacks dealerId.

        // Use getAllCorporateEnquiries logic but maybe we should warn or just return all.
        // For now, delegating to getAll logic:
        return getAllCorporateEnquiries(req, res);
    } catch (error) {
        console.error("Error fetching pending corporate enquiries:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    getAllCorporateEnquiries,
    getCorporateEnquiryById,
    deleteCorporateEnquiry,
    getPendingCorporateEnquiries
};
