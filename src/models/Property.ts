import mongoose, { Schema } from "mongoose";
import "./User"; // Ensure User model is registered before Property model references it

export type PropertyDocument = mongoose.Document & {
    slug: string;
    title: string;
    pricePerNight: number;
    city: string;
    address?: string;
    bedrooms: number;
    bathrooms: number;
    sizeM2: number;
    description: string;
    category: string;
    amenities: string[];
    mainImage: string;
    galleryImages: string[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const PropertySchema = new Schema<PropertyDocument>(
    {
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        title: { type: String, required: true, trim: true },
        pricePerNight: { type: Number, required: true },
        city: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        sizeM2: { type: Number, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        amenities: { type: [String], default: [] },
        mainImage: { type: String, required: true },
        galleryImages: { type: [String], default: [] },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Property =
    (mongoose.models.Property as mongoose.Model<PropertyDocument>) ||
    mongoose.model<PropertyDocument>("Property", PropertySchema);
