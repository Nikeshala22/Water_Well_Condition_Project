import mongoose from "mongoose";

const wellSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "UnderMaintenance"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Well", wellSchema);
