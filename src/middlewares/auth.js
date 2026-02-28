const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token yo‘q" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // payload: { userId, role }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token xato yoki eskirgan" });
  }
};