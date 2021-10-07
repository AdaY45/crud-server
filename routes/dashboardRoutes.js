const { Router } = require("express");
const { Profile } = require("./models/Profiles");
const { User } = require("./models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const profileCount = await Profile.countDocuments();

    const ms18years = 568080000000;

    const profiles = await Profile.find();

    return res.json({ usersCount, profileCount, profiles })
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

module.exports = { dashboardRouter: router };
