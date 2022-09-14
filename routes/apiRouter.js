const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");

// Refresh profile list every minute ------------------------------------------------------- Get profile pictures

const directory = path.join(__dirname, "../public/profiles"); // Not in root

let profiles = ["user.png"];

const refreshProfiles = () => {
  profiles = fs.readdirSync(directory, (err, files) => {
    if (err) {
    } else {
      return files;
    }
  });
};

refreshProfiles();
setInterval(refreshProfiles, 1 * 60 * 1000);

const authenticationStation = require("../controllers/authenticationStation");
const userController = require("../controllers/userController");
const gameController = require("../controllers/gameController");

// CORE ROUTES ----------------------------------------------------------------------------- Core routes

router.route("/create-account").post(authenticationStation.createAccount);
router.route("/log-in").post(authenticationStation.logIn);

// Create game (one request)
router
  .route("/play/fir/:string")
  .post(
    authenticationStation.protect,
    gameController.create,
    userController.sendGameInvities
  );
// Play the game
router
  .route("/play/:string")
  .post(authenticationStation.protect, gameController.play);
router
  .route("/sync/:string")
  .post(
    authenticationStation.protect,
    userController.updateOnline,
    gameController.play
  );

// Find user by data ----------------------------------------------------------------------- Find users

router.route("/me").post(
  authenticationStation.protect,
  (req, res, next) => {
    req.params.string = req.user.name;
    next();
  },
  userController.updateOnline,
  userController.getUser
);
router
  .route("/users/:string")
  .get(userController.getUser)
  .post(
    authenticationStation.protect,
    userController.updateOnline,
    userController.getUser
  );

// Get info about all friends -------------------------------------------------------------- Get info about all users friends

router
  .route("/friend-data")
  .get(authenticationStation.protect, userController.sendFriendData);

// Manage friends -------------------------------------------------------------------------- Manage friends

router
  .route("/add-friend/:string")
  .post(authenticationStation.protect, userController.addFriend);
router
  .route("/confirm-friend/:string")
  .post(authenticationStation.protect, userController.confirmFriend);
router
  .route("/remove-friend/:string")
  .post(authenticationStation.protect, userController.removeFriend);

// Manage notifications -------------------------------------------------------------------- Manage notifications

router
  .route("/delete-notification/:string")
  .post(authenticationStation.protect, userController.deleteNotification);

// Update the users online ----------------------------------------------------------------- Update the users online

router
  .route("/echo")
  .post(
    authenticationStation.protect,
    userController.updateOnline,
    (req, res, next) =>
      res.status(200).json({
        status: "success",
        message: "Profile updated",
      })
  );

// Get users ------------------------------------------------------------------------------- Get users

router.route("/search-users/:string").get(userController.userList);

// Get all profiles ------------------------------------------------------------------------ Get all profiles

router.route("/all-profiles").get((req, res, next) => {
  res.status(200).json({
    status: "success",
    dataType: "images",
    data: profiles,
  });
});

module.exports = router;
