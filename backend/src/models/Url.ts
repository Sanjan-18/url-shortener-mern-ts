import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

const urlSchema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true, trim: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Url = mongoose.model<IUrl>("Url", urlSchema);
