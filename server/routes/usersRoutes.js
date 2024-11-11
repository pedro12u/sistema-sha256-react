const express = require("express");
const {
  registerUser,
  loginUser,
  getUserHashes,
  getUserAES,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/hashes", getUserHashes);
router.get("/aes", getUserAES);

module.exports = router;
