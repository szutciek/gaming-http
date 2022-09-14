const express = require("express");
const router = express.Router();

const gameManager = require("../gameManager");

router
  .route("/create")
  .get(gameManager.startScreen)
  .post(gameManager.createGame);
router.route("/:room").get(gameManager.gameScreen).post(gameManager.game);
router.route("/refresh/:room").get(gameManager.refresh);
router.route("/reset/:room").post(gameManager.reset);

module.exports = router;
