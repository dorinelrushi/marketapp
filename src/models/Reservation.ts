import mongoose, { Schema } from "mongoose";
import "./User"; // Ensure User model is registered
import "./Property"; // Ensure Property model is registered

export type ReservationDocument = mongoose.Document & {
    propertyId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    email: string;
    mediationFeePaid: boolean;
    mediationPaymentId?: string;
    message?: string;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
};

const ReservationSchema = new Schema<ReservationDocument>(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        message: { type: String, trim: true },
        mediationFeePaid: { type: Boolean, default: false },
        mediationPaymentId: { type: String },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const Reservation =
    (mongoose.models.Reservation as mongoose.Model<ReservationDocument>) ||
    mongoose.model<ReservationDocument>("Reservation", ReservationSchema);
