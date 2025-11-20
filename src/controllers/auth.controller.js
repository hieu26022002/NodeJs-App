const login = (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  res.json({ message: `Welcome ${username}!`, token: "fake-jwt-token" });
};

const getProfile = (req, res) => {
  res.json({ id: 1, username: "demo-user", roles: ["user"] });
};

const register = (req, res) => {
  res.json({ message: "Register success" });
};

// Export hàm ra ngoài để route sử dụng import
module.exports = {
  login,
  getProfile,
  register
};
