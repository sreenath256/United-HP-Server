require("dotenv").config();
const mongoose = require("mongoose");
const ContactEnquiry = require("../model/contactEnquiry");

const cities = [
    "City A", "City B", "City C", "City D", "City E", "City F"
];

const categories = [
    "Support", "Sales", "General", "Complaints", "Feedback"
];

const names = [
    "John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Davis"
];

const generateRandomEnquiry = (i) => {
    return {
        name: `${names[Math.floor(Math.random() * names.length)]} ${i}`,
        mobileNumber: `98765432${i.toString().padStart(2, '0').slice(-2)}`,
        email: `user${i}@example.com`,
        city: cities[Math.floor(Math.random() * cities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
    };
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const enquiries = [];
        for (let i = 1; i <= 500; i++) {
            enquiries.push(generateRandomEnquiry(i));
        }

        await ContactEnquiry.insertMany(enquiries);
        console.log(`Successfully seeded ${enquiries.length} contact enquiries.`);

        mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
