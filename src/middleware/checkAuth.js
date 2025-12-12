import jwt from "jsonwebtoken";

export function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

export const checkAuth = (req, res, next) => {
  const status = true;
  if (status) {
    next();
  } else {
    console.log("Nothingg!!!!");
  }
}

// Middleware xác thực JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Token không được cung cấp" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Lưu userId vào request để sử dụng trong controller
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token đã hết hạn" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token không hợp lệ" });
    }
    return res.status(500).json({ error: "Lỗi xác thực token" });
  }
}

// export const requireSignin = expressJWT({
//   algorithms: ["HS256"],
//   secret: "123456",
//   requestProperty: "auth" // req.auth    
// });


export const isAuth = (req, res, next) => {
  console.log('req.profile', req.profile);
  console.log('req.auth', req.auth);

  const status = req.profile._id == req.auth._id;
  if (!status) {
    res.status(400).json({
      message: "Bạn không có quyền truy cập"
    })
  }
  next();
}
export const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(401).json({
      message: "You're not Admin"
    })
  }
  next();
}



