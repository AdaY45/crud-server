const { Router } = require("express");
const { Profile } = require("./models/Profiles");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const profiles = await Profile.find({
      owner:
        req.params.id && req.user.type === "admin"
          ? req.params.id
          : req.user.id,
    });

    return res.json(profiles);
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const profiles = await Profile.find();

    return res.json(profiles);
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { birthdate, ...rest } = req.body;
    const msBirthdate = +new Date(birthdate)

    const profile = await Profile({ ...rest, birthdate: msBirthdate, owner: req.user.id });

    await profile.save();

    return res.json(profile);
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.patch("/edit", authMiddleware, async (req, res) => {
  try {
    const { _id, birthdate, ...profileData } = req.body;

    const msBirthdate = +new Date(birthdate);

    const profile = await Profile.findOne({ _id });

    if (!profile) {
      throw { errors: [{ message: `Profile doesn't exit` }] };
    }

    if (`${profile.owner}` === req.user.id || req.user.type === `admin`) {
      await Profile.updateOne({ _id }, { ...profileData, birthdate: msBirthdate });
      return res.json({ message: `Profile succesfully updated!` });
    } else {
      return res.status(400).json({ errors: [{ message: `Profile is not yours` }] });
    }
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.body._id });

    if (!profile) {
      throw { errors: [{ message: `Profile doesn't exit` }] };
    }

    if (`${profile.owner}` === req.user.id || req.user.type === `admin`) {
      await Profile.deleteOne({ _id: req.body._id });

      return res.json({ message: `Profile succesfully deleted!` });
    } else {
      return res.status(400).json({ errors: [{ message: `Profile is not yours` }] });
    }
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

module.exports = { profilesRouter: router };
