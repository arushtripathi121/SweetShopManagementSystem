export const isAdmin = (req, res, next) => {
    return res.status(500).json({
        success: false,
        message: "Admin middleware not implemented"
    });
};
