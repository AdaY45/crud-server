const { Router } = require("express");
const { User } = require("./models/User");
const { Profile } = require("./models/Profiles");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "Empty user id" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({ message: "This user doesn't exist" });
    }

    return res.json({
      username: user.username,
      email: user.email,
      type: user.type,
    });
  } catch (e) {
    return res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.type === `admin`) {
      const users = await User.find();

      return res.status(200).json(users);
    } else {
      return res.status(403).json({ message: `Permission denied` });
    }
  } catch (e) {
    return res.status(500).json({ errors: [{ msg: `Server error` }] });
  }
});

router.patch("/edit", authMiddleware, async (req, res) => {
  try {
    console.log(req.body)
    const { _id, ...restBody } = req.body;
    if (req.user.type !== `admin`) {
      return res
        .status(403)
        .json({ errors: [{ msg: `You don't have permission` }] });
    }

    if (!_id) {
      return res
        .status(404)
        .json({ errors: [{ msg: `This user doesn't exist` }] });
    }

    await User.updateOne({ _id: _id }, restBody);
    return res.json( {_id: _id, restBody });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errors: [{ msg: `Server error` }] });
  }
});

router.delete(`/delete`, authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;

    if (req.user.type !== `admin`) {
      return res
        .status(403)
        .json({ errors: [{ msg: `You don't have permission` }] });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: `User not found` }] });
    }

    const data = await Profile.deleteMany({
      _id: {
        $in: user.profiles,
      },
    });

    if (!userId) {
      return res
        .status(404)
        .json({ errors: [{ msg: `This user doesn't exist` }] });
    }

    await User.deleteOne({ _id: userId });
    return res.json({ message: `User deleted` });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errors: [{ msg: `Server error` }] });
  }
});

module.exports = { usersRouter: router };
