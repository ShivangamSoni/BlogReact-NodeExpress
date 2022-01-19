const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { JWT_Secrete_Key, JWT_Config, SALT_ROUNDS } = require("../CONSTANTS");
const verifyEmail = require("../Utils/verifyEmail");
const verifyUsername = require("../Utils/verifyUsername");
const bodyRequired = require("../Middleware/bodyRequired");
const express = require("express");
const router = express.Router();

// User Data
let Users = require("../../Models/Users.json");
const verifyJWT = require("../Middleware/verifyJWT");
const UsersFilePath = path.resolve(__dirname, "../", "../", "Models", "Users.json");

/**
 * @method POST
 * @listens /api/v1/user/register
 * @description Register a New User
 */
router.post("/register", bodyRequired, async (req, res) => {
  const newUser = req.body;

  const isEmailAvailable = verifyEmail(newUser.email, Users);
  if (!isEmailAvailable.success) {
    res.status(409).json(isEmailAvailable);
    return;
  }

  const isUsernameAvailable = verifyUsername(newUser.username, Users);
  if (!isUsernameAvailable.success) {
    res.status(409).json(isUsernameAvailable);
    return;
  }

  newUser.id = uuid();
  newUser.reactions = [];

  try {
    const encryptedPassword = await bcrypt.hash(newUser.password, SALT_ROUNDS);
    newUser.password = encryptedPassword;
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }

  Users.push(newUser);

  try {
    await fs.writeFile(UsersFilePath, JSON.stringify(Users));

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @method POST
 * @listens /api/v1/user/login
 * @description Authenticate the User & generate a Token
 */
router.post("/login", bodyRequired, async (req, res) => {
  const { email, password } = req.body;

  const user = Users.filter((user) => user.email === email)[0];

  if (!user) {
    res.status(404).json({ success: false, message: "Email Not Registered" });
    return;
  }

  try {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(404).json({ success: false, message: "Incorrect Password" });
      return;
    }

    const payload = { userId: user.id };
    const token = JWT.sign(payload, JWT_Secrete_Key, JWT_Config);
    res.json({ success: true, token });
  } catch (e) {
    res.status(404).json({ success: false, message: "Incorrect Password2" });
    return;
  }
});

/**
 * @method GET
 * @listens /api/v1/user/verify/email
 * @description Verify if the User Entered Email is already registered
 */
router.get("/verify/email", (req, res) => {
  const { email } = req.query;
  const responseJSON = verifyEmail(email, Users);
  if (responseJSON.success) {
    res.json(responseJSON);
    return;
  }

  res.status(409).json(responseJSON);
});

/**
 * @method GET
 * @listens /api/v1/user/verify/username
 * @description Verify if the User Entered Username is already registered
 */
router.get("/verify/username", (req, res) => {
  const { username } = req.query;
  const responseJSON = verifyUsername(username, Users);
  if (responseJSON.success) {
    res.json(responseJSON);
    return;
  }

  res.status(409).json(responseJSON);
});

/**
 * @method GET
 * @listens /api/v1/user/verify/token
 * @description Verify Token
 */
router.get("/verify/token", verifyJWT, (req, res) => {
  res.json({ success: true, message: "Token Valid" });
});

/**
 * @method GET
 * @listens /api/v1/user/:id
 * @description Retrieve User as per ID
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = Users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ success: false, message: "User Not Found" });
    return;
  }

  const { name, username, email } = user;

  res.json({ success: true, data: { name, username, email } });
});

/**
 * @method GET
 * @listens /api/v1/user
 * @description Retrieve the LoggedIn Users data
 */
router.get("/", verifyJWT, (req, res) => {
  const { userId } = req.payload;
  const user = Users.filter((user) => user.id === userId)[0];

  if (!user) {
    res.status(404).json({ success: false, message: "User doesn't Exist" });
    return;
  }

  const { name, username, email } = user;

  res.json({ success: true, data: { name, username, email } });
});

/**
 * @method PUT
 * @listens /api/v1/user/vote
 * @description Update the UpVote Array
 */
router.put("/vote", verifyJWT, bodyRequired, async (req, res) => {
  const { blogId } = req.body;
  const { userId } = req.payload;

  const user = Users.filter((u) => u.id === userId)[0];
  let count = 0;

  if (user.reactions.includes(blogId)) {
    count = -1;
    user.reactions = user.reactions.filter((reaction) => reaction !== blogId);
  } else {
    count = 1;
    user.reactions.push(blogId);
  }

  Users = Users.filter((user) => user.id !== userId);
  Users.push(user);

  try {
    await fs.writeFile(UsersFilePath, JSON.stringify(Users));
    res.json({ success: true, count });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
