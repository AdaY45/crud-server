const { Router } = require("express");
const { User } = require("./models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: "Empty user id" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({ message: "This user doesn't exist" });
    }

    res.json({ username: user.username, email: user.email, type: user.type });
  } catch (e) {
    res.status(500).json({ errors: [{ message: `Server error` }] });
  }
});

// router.get('/', authMiddleware, async(req, res) => {
//     try {
//         if(req.type === 'admin') {

//         }
//     }
// })
