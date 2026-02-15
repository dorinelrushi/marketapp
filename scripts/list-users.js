
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env");
    process.exit(1);
}

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        hasPaidOneTimeFee: Boolean,
    },
    { strict: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function listUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB. Listing Users:");
        console.log("---------------------------------------------------");
        console.log("Email".padEnd(30) + "| Paid Fee? | Name");
        console.log("---------------------------------------------------");

        const users = await User.find({});

        users.forEach(user => {
            const paidStatus = user.hasPaidOneTimeFee ? "YES" : "NO ";
            console.log(`${user.email.padEnd(30)} | ${paidStatus}     | ${user.fullName}`);
        });

        console.log("---------------------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

listUsers();
