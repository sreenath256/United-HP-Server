const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactEnquirySchema = new Schema(
    {
        name: {
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
        city: {
            type: String, // Storing district name as string
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        
    },
    { timestamps: true }
);

const ContactEnquiry = mongoose.model("ContactEnquiry", contactEnquirySchema);

module.exports = ContactEnquiry;
