import prisma from "../prisma/index.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const files = req.files;

        console.log("Request body:", { name, description, price });
        console.log("Files:", files ? files.map(f => f.filename) : "No files");

        if (!name || !price) {
            return res.status(400).json({ message: "Thiếu name hoặc price" });
        }

        if (!files || files.length === 0) {
            return res
                .status(400)
                .json({ message: "Cần ít nhất 1 ảnh sản phẩm" });
        }

        const imageUrls = files.map(
            (file) => `/uploads/products/${file.filename}`
        );

        console.log("Image URLs:", imageUrls);

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                images: imageUrls,
            },
        });

        return res.status(201).json({
            message: "Tạo sản phẩm thành công",
            data: product,
        });
    } catch (err) {
        console.error("Error creating product:", err);
        console.error("Error stack:", err.stack);
        return res.status(500).json({
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { details: err.stack })
        });
    }
};
