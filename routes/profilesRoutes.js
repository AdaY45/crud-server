const { Router } = require("express");
const { Profile } = require("./models/Profiles");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.get("/:id?", authMiddleware, async (req, res) => {
  try {
    //const userId = req.params.id;
    const userId = req.user.id;

    const profiles = await Profile.find({
      owner:
        req.params.is && req.user.type === "admin"
          ? req.params.id
          : req.user.id,
    });

    // if (!userId) {
    //   res.status(400).json({ message: "Empty user id" });
    // }

    // const profiles = await Profile.find({ owner: userId });

    res.json(profiles);
  } catch (e) {
    res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

// router.get("/path", authMiddleware, async (req, res) => {
//   try {
//     const profiles = await Profile.find({});

//     return profiles;
//   } catch (e) {
//     res.status(500).json({ errors: [{ message: `Server error` }] });
//   }
// });

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile({ ...req.body, owner: req.user.id });

    await profile.save();

    //res.status(201).json({ message: `Profile succesfully created` });
    return res.json(profile);
  } catch (e) {
    res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

module.exports = { profilesRouter: router };
