import mongoose from "mongoose";

const sweetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 4.5
        },

        description: {
            type: String,
            required: false,
            default: "A delicious handcrafted sweet prepared using premium ingredients."
        }
    },
    { timestamps: true }
);

export default mongoose.model("Sweet", sweetSchema);
