import bcrypt from "bcryptjs";
import prisma from "../prisma/index.js";
import jwt from "jsonwebtoken";

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email và password là bắt buộc" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token 1 ngày
    );

    return res.json({
      message: "Login Succesfully",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GetAll
export const getProfile = (req, res) => {
  res.json({ id: 1, username: "demo-user", roles: ["user"] });
};

// ?? null => null undefined
// || false => null 0 "" false undefined []

// Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body ?? {}; // tránh TH req.body bị ko xác định

    if (!email || !password) {
      return res.status(400).json({ error: "Email và password là bắt buộc" });
    }

    // Check email tồn tại
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    // Hash password: mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào DB
    const user = await prisma.user.findUnique({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.json({ message: "Register OK", userId: user.id });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get Information Account - Lấy thông tin cá nhân của người dùng
export const getInfomationAccount = async (req, res) => {
  try {
    const userId = req.userId; // Lấy từ middleware verifyToken

    if (!userId) {
      return res.status(401).json({ error: "Không xác thực được người dùng" });
    }

    // Lấy thông tin người dùng từ database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true
        // Không trả về password
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    return res.json({
      message: "Lấy thông tin tài khoản thành công",
      data: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Get information account error:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
}