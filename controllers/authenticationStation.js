const User = require('../models/userModel');
const UserError = require('../utils/UserError');
const util = require('util');
const functions = require('../utils/functions');

const jwt = require('jsonwebtoken');

const signToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSignSendToken = (user, res) => {
  const id = user._id;
  const name = user.name;
  const token = signToken(id, name);

  res.status(200).json({
    status: 'success',
    message: `Welcome, ${name}`,
    token,
    dataType: 'user',
    data: {
      user,
    },
  });
};

exports.createAccount = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profile: req.body.profile,
    });
    res.status(200).json({
      message: 'Account created',
      dataType: 'user',
      data: {
        newUser,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = `An account with this ${Object.keys(
        err.keyPattern
      )} already exists`;
      return next(new UserError(err.message, 400));
    } else if (err.name === 'ValidationError') {
      err.message = Object.values(err.errors).map((el) => el.message);
      next(new UserError(err.message[0], 400));
    } else {
      next(err);
    }
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return next(new UserError('Provide a email and password', 400));
    }
    if (!functions.validateEmail(email)) {
      return next(new UserError('Provide a valid email', 400));
    }
    const user = await User.findOne({ email }).select('+password'); // FIND ONE
    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new UserError('Incorrect email or password', 400));
    } else {
      createSignSendToken(user, res);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token.length < 50) {
      return next(new UserError('You are not logged in', 401));
    }
    if (!functions.validateManyCharacters(token)) {
      return next(new UserError('Provide a valid token', 400));
    }
    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const currentUser = await User.findById(decodedToken?.id).select(
      '+changedPassword'
    );
    if (!currentUser) {
      return next(new UserError('User does no longer exist', 401));
    }
    if (currentUser.changedPasswordAfter(decodedToken.iat)) {
      return next(
        new AppError('Recently changed password. Please log in again', 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UserError('Please log in again', 401));
    } else if (err.name === 'JsonWebTokenError') {
      err.code = 701;
      return next(new UserError('Token error. Try clearing your cookies', 403));
    }
    next(err);
  }
};

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have the required yellow papers', 401)
      );
    }
    next();
  };
};
