const express = require("express");
const router = express.Router();

const panelController = require("../controllers/panelController");

router.route("/panel").get(panelController.sendPanel);
router.route("/:string").get(panelController.sendUserPanel);

module.exports = router;
