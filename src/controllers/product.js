import prisma from "../prisma/index.js";

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const files = req.files;

        console.log("Request body:", { name, description, price });
        console.log("Files:", files ? files.map((f) => f.filename) : "No files");

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
            ...(process.env.NODE_ENV === "development" && { details: err.stack }),
        });
    }
};

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            data: products,
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: err.message });
    }
};

// Cập nhật sản phẩm theo id
export const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const files = req.files;

        const productId = Number(id);
        if (Number.isNaN(productId)) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }

        // Kiểm tra tồn tại
        const existing = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        // Chuẩn bị dữ liệu cập nhật (chỉ cập nhật field gửi lên)
        const data = {};
        if (name !== undefined) data.name = name;
        if (description !== undefined) data.description = description;
        if (price !== undefined) data.price = Number(price);

        // Nếu có upload ảnh mới thì thay thế images
        if (files && files.length > 0) {
            const imageUrls = files.map(
                (file) => `/uploads/products/${file.filename}`
            );
            data.images = imageUrls;
        }

        const updated = await prisma.product.update({
            where: { id: productId },
            data,
        });

        return res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            data: updated,
        });
    } catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: err.message });
    }
};

// Xóa sản phẩm theo id
export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const productId = Number(id);
        if (Number.isNaN(productId)) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }

        // Kiểm tra tồn tại
        const existing = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existing) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        await prisma.product.delete({
            where: { id: productId },
        });

        return res.status(200).json({
            message: "Xóa sản phẩm thành công",
        });
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ error: err.message });
    }
};
