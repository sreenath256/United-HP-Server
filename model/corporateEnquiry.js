const mongoose = require("mongoose");
const { Schema } = mongoose;

const corporateEnquirySchema = new Schema(
    {
        institutionName: {
            type: String,
            required: true,
        },
        contactPerson: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        district: {
            type: String, // Storing district name as string
            required: true,
        },
        productCategory: {
            type: String,
            required: true,
        },
        quantityRequired: {
            type: Number,
            required: true,
        },
        briefRequirement: {
            type: String,
        },
    },
    { timestamps: true }
);

const CorporateEnquiry = mongoose.model("CorporateEnquiry", corporateEnquirySchema);

module.exports = CorporateEnquiry;
