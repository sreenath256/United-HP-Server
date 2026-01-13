require("dotenv").config();
const mongoose = require("mongoose");
const CorporateEnquiry = require("../model/corporateEnquiry");

const districts = [
    "District A", "District B", "District C", "District D", "District E"
];

const categories = [
    "Laptops", "Desktops", "Printers", "Accessories", "Servers"
];

const institutions = [
    "Tech Corp", "Edu Institute", "Health Care Ltd", "Fin Bank", "Gov Dept"
];

const generateRandomEnquiry = (i) => {
    return {
        institutionName: `${institutions[Math.floor(Math.random() * institutions.length)]} ${i}`,
        contactPerson: `Person ${i}`,
        mobileNumber: `98765432${i.toString().padStart(2, '0').slice(-2)}`,
        email: `contact${i}@example.com`,
        district: districts[Math.floor(Math.random() * districts.length)],
        productCategory: categories[Math.floor(Math.random() * categories.length)],
        quantityRequired: Math.floor(Math.random() * 100) + 1,
        briefRequirement: `Requirement description for enquiry ${i}`,
    };
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Optional: Clear existing data
        // await CorporateEnquiry.deleteMany({});
        // console.log("Cleared existing corporate enquiries...");

        const enquiries = [];
        for (let i = 1; i <= 500; i++) {
            enquiries.push(generateRandomEnquiry(i));
        }

        await CorporateEnquiry.insertMany(enquiries);
        console.log(`Successfully seeded ${enquiries.length} corporate enquiries.`);

        mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
