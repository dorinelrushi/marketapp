import mongoose, { Schema } from "mongoose";

export type PaymentDocument = mongoose.Document & {
    userId: mongoose.Types.ObjectId;
    type: "mediation_fee" | "subscription";
    amount: number;
    currency: string;
    paypalId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

const PaymentSchema = new Schema<PaymentDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: ["mediation_fee", "subscription"],
            required: true,
        },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: "USD" },
        paypalId: { type: String, required: true },
        status: { type: String, required: true },
    },
    { timestamps: true }
);

export const Payment =
    (mongoose.models.Payment as mongoose.Model<PaymentDocument>) ||
    mongoose.model<PaymentDocument>("Payment", PaymentSchema);
