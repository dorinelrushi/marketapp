
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

async function checkUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Check the user from the screenshot/context
        const email = "aaaaaa@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.fullName} (${user.email})`);
            console.log(`hasPaidOneTimeFee: ${user.hasPaidOneTimeFee}`);

            // OPTIONAL: Manually set it to true if it is false, just to unblock the user while we debug
            if (!user.hasPaidOneTimeFee) {
                console.log("User has NOT paid. Attempting to manually mark as paid for testing...");
                // user.hasPaidOneTimeFee = true;
                // await user.save();
                // console.log("User manually marked as PAID.");
            }
        } else {
            console.log("User not found: " + email);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkUser();
