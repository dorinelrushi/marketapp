import mongoose, { Schema } from "mongoose";

export type UserDocument = mongoose.Document & {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "admin" | "client";
  subscriptionStatus: "inactive" | "active";
  subscriptionId?: string;
  hasPaidOneTimeFee?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    subscriptionStatus: { type: String, enum: ["inactive", "active"], default: "inactive" },
    subscriptionId: { type: String },
    hasPaidOneTimeFee: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

