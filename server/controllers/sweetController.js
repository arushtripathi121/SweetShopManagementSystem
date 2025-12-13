import Sweet from "../models/Sweet.js";

const sendError = (res, code, message) => {
    return res.status(code).json({ success: false, message });
};

const sendSuccess = (res, code, data = {}) => {
    return res.status(code).json({ success: true, ...data });
};


// ADD SWEET
export const addSweet = async (req, res) => {
    const { name, category, price, quantity, image, rating, description } = req.body;

    try {
        if (!name || !category || price == null || quantity == null || !image) {
            return sendError(res, 400,
                "All fields (name, category, price, quantity, image) are required"
            );
        }

        const sweet = await Sweet.create({
            name,
            category,
            price,
            quantity,
            image,
            rating: rating ?? 4.5,
            description: description ?? "A delicious handcrafted sweet prepared using premium ingredients."
        });

        return sendSuccess(res, 201, { sweet });

    } catch {
        return sendError(res, 500, "Internal server error");
    }
};


// GET ALL SWEETS
export const getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find();
        return sendSuccess(res, 200, { sweets });

    } catch {
        return sendError(res, 500, "Internal server error");
    }
};


// SEARCH SWEETS
export const searchSweets = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        const filter = {};

        if (name) filter.name = { $regex: name, $options: "i" };
        if (category) filter.category = { $regex: category, $options: "i" };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(filter);
        return sendSuccess(res, 200, { sweets });

    } catch {
        return sendError(res, 500, "Internal server error");
    }
};


// UPDATE SWEET
export const updateSweet = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedSweet = await Sweet.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedSweet) {
            return sendError(res, 404, "Sweet not found");
        }

        return sendSuccess(res, 200, { sweet: updatedSweet });

    } catch {
        return sendError(res, 500, "Internal server error");
    }
};


// DELETE SWEET
export const deleteSweet = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSweet = await Sweet.findByIdAndDelete(id);

        if (!deletedSweet) {
            return sendError(res, 404, "Sweet not found");
        }

        return sendSuccess(res, 200, { message: "Sweet deleted successfully" });

    } catch {
        return sendError(res, 500, "Internal server error");
    }
};
