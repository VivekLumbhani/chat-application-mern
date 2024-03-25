const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register User
router.post("/", registerUser);

// Login User
router.post("/login", authUser);


router.get("/",protect, allUsers);


module.exports = router;
