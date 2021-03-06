const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded.roles[0] !== role) {
        return res.status(403).json({ message: "У вас нет доступа" });
      }
      req.user = decoded;

      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
  };
};
