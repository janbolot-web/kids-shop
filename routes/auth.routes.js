const Router = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const { jwtSecret } = require("../config");

router.post(
  "/registration",
  [
    check("email", "Некорректный емeйл").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors,
          message: "Некорректные данные при входе в систему",
        });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Такой пользователь уже существует" });
      }
      const hashPassword = await bcrypt.hash(password, 7);
      const user = new User({ email, password: hashPassword });

      await user.save();

      res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Введите корректный емeйл").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors, message: "Некорректные данные при входе в систему" });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ message: "Неверный пароль, попробуйте снова!" });
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.json({ token, userId: user._id });
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
