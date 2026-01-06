import express from "express";
import {
    createProduct,
    deleteProductById,
    getAllProducts,
    updateProductById,
} from "../controllers/product.js";
import upload from "../middleware/uploadFile.js";

const router = express.Router();

// Middleware xử lý lỗi Multer
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error("Multer error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                error: "File quá lớn. Kích thước tối đa là 5MB",
            });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                error: "Quá nhiều file. Tối đa 5 file",
            });
        }
        if (err.message === "Unexpected field") {
            return res.status(400).json({
                error:
                    "Field name không đúng. Vui lòng sử dụng field name 'images' cho file upload",
            });
        }
        if (err.message === "Chỉ cho phép upload ảnh") {
            return res.status(400).json({
                error: err.message,
            });
        }
        return res.status(400).json({ error: err.message });
    }
    next();
};

// Product routes
router.post(
    "/products",
    upload.array("images", 5),
    handleMulterError,
    createProduct
);

// Lấy tất cả sản phẩm
router.get("/products", getAllProducts);

// Cập nhật sản phẩm theo id (có thể gửi kèm ảnh mới)
router.put(
    "/products/:id",
    upload.array("images", 5),
    handleMulterError,
    updateProductById
);

// Xóa sản phẩm theo id
router.delete("/products/:id", deleteProductById);

export default router;

