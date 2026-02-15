
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env");
    process.exit(1);
}

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, trim: true, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        phone: { type: String, trim: true },
        role: { type: String, enum: ["admin", "client"], default: "client" },
        subscriptionStatus: { type: String, enum: ["inactive", "active"], default: "inactive" },
        subscriptionId: { type: String },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const email = "admin@example.com";
        const password = "adminpassword";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Admin user already exists.");
            existingUser.role = "admin";
            await existingUser.save();
            console.log("Updated existing user to admin.");
        } else {
            const passwordHash = await bcrypt.hash(password, 10);
            await User.create({
                fullName: "Admin User",
                email,
                passwordHash,
                role: "admin",
                phone: "1234567890",
                subscriptionStatus: "active"
            });
            console.log(`Admin user created. Email: ${email}, Password: ${password}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();
