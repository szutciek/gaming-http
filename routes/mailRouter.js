const express = require("express");
const router = express.Router();

const mailService = require("../controllers/mailController");

router.route("/sub-to-news").post(mailService.subToNews);
router.route("/sub-to-invs").post(mailService.subToInvs);

module.exports = router;
