const { Router } = require("express");
const { User } = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

const generateAccessToken = (id, type) => {
  const payload = {
    id,
    type,
  };
  return jwt.sign(payload, secret, { expiresIn: "30d" });
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ message: `User doesn't exist` }] });
    }

    const token = generateAccessToken(user._id, user.type);
    return res.json({token, user: {_id: user._id, username: user.username, email: user.email, type: user.type}});

  } catch (e) {
    res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, type, username } = req.body;
    console.log(req.body);

    const canditate = await User.findOne({ email });

    if (canditate) {
      return res
        .status(400)
        .json({ errors: [{ message: `User already exists` }] });
    }

    const hashPassword = bcrypt.hashSync(password, 7);

    const user = new User({ email, password: hashPassword, type, username });

    await user.save();

    const token = generateAccessToken(user._id, user.type);
    return res.json({token, user: {_id: user._id, username: user.username, email: user.email, type: user.type}});

    // return res.status(201).json({ message: `User created succesfully` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

module.exports = { authRouter: router };
