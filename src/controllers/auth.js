import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/index.js";

// Login
export const login = async (req, res) => {
  try {
    console.debug("Login raw body:", req.body);
    const payload = req.body?.data ?? req.body ?? {};
    const { email, password } = payload;

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

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in environment variables");
      return res.status(500).json({ error: "Cấu hình server không đúng" });
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
    const payload = req.body?.data ?? req.body ?? {}; // tránh TH req.body bị ko xác định hoặc bọc { data: ... }
    const { email, password } = payload;
    console.debug("Register payload email:", email);

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
    const user = await prisma.user.create({
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
        createdAt: true,
        name: true
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
        createdAt: user.createdAt,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Get information account error:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
}

// update thông tin cá nhân
export const updateInformationAccount = async (req, res) => {
  try {
    const userId = req.userId; // set bởi verifyToken
    const payload = req.body?.data ?? req.body ?? {};
    const { name, email } = payload;

    if (!userId) {
      return res.status(401).json({ error: "Không xác thực được người dùng" });
    }
    if (!name || !email) {
      return res.status(400).json({ error: "Thiếu name hoặc email" });
    }

    // Check trùng email:
    const exists = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
      select: { id: true },
    });
    if (exists) {
      return res.status(409).json({ error: "Email trùng" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: {
        id: true,
        email: true,
        createdAt: true,
        name: true,
      },
    });

    return res.json({
      message: "Cập nhật thông tin tài khoản thành công",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update information account error:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};