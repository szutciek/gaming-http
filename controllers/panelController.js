const path = require('path');
const User = require('../models/userModel');
const UserError = require('../utils/UserError');
const functions = require('../utils/functions');

exports.sendPanel = (req, res, next) => {
  res.sendFile(path.join(__dirname, '../pages/panel.html'));
};
exports.sendUserPanel = async (req, res, next) => {
  if (!functions.validateManyCharacters(req.params.string)) {
    return next(new UserError('Name includes invalid characters', 400));
  }
  if (User.find({ name: req.params.string })) {
    res.sendFile(path.join(__dirname, '../pages/userPanel.html'));
  } else {
    next();
  }
};
