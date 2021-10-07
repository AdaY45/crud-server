const { Router } = require("express");
const { User } = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ message: `User doesn't exist` }] });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);

    if (!isMatchPass) {
      return res
        .status(400)
        .json({
          errors: [{ msg: `Wrong password or email` }],
        });
    }

    const createdAtToken = Date.now();

    const token = jwt.sign({id: user._id, type: user.type, createdAt: createdAtToken}, secret, { expiresIn: "30d" });

    await user.updateOne({ lastTokenTimestamp: createdAtToken });

    return res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
      createdAt: createdAtToken,
    });

  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, type, username } = req.body;

    const canditate = await User.findOne({ email });

    if (canditate) {
      return res
        .status(400)
        .json({ errors: [{ message: `User already exists` }] });
    }

    const hashPassword = bcrypt.hashSync(password, 7);

    const user = new User({
      email,
      password: hashPassword,
      type,
      username,
      lastTokenTimestamp: 0,
    });

    await user.save();

    return res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const token = jwt.sign({id: req.user.id}, secret, { expiresIn: "30d" });

    return res.json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.get(`/newToken`, authMiddleware, async (req, res) => {
  try {
    const createdAtToken = Date.now();

    const token = jwt.sign({id: req.user.id, type: req.user.type, createdAt: createdAtToken}, secret, { expiresIn: "30d" });

    await User.updateOne(
      { _id: req.user.id },
      { lastTokenTimestamp: createdAtToken }
    );

    return res.json({ token, userId: req.user.id, type: req.user.type, createdAt: createdAtToken });
  } catch (e) {
    return res
      .status(500)
      .json({ errors: [{ message: `Server error` }] });
  }
});

module.exports = { authRouter: router };
