const User = require('../models/userModel');
const UserError = require('../utils/UserError');
const functions = require('../utils/functions');

// Update online --------------------------------------------------------------------------- Update online
// Used to update the user's online parameters
exports.updateOnline = async (req, res, next) => {
  try {
    req.user.lastOnlineLocation = req.body?.location || 'Unknown';
    req.user.timePlayed = req.user.timePlayed + 0.1;
    await req.user.save();
    next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new UserError(`You can't be doing this`, 400));
    }
    next(err);
  }
};

// Get users data -------------------------------------------------------------------------- Get users data
// Secure - can be used to get users data (with auth middleware before)

exports.getUser = async (req, res, next) => {
  try {
    const data = req.params.string;
    if (!data) {
      return next(new UserError("Didn't recieve data", 400));
    }
    if (!functions.validateManyCharacters(data)) {
      return next(new UserError('Data contains invalid characters', 400));
    }
    let user = {};
    if (!functions.validateEmail(data)) {
      user = await User.findOne({ name: data });
    } else {
      user = await User.findOne({ email: data });
    }
    if (!user) {
      return next(new UserError(`No user with the specified data`, 400));
    } else {
      if (req.user?.friends.includes(user._id)) {
        res.status(200).json({
          status: 'success',
          message: `Sent user's data`,
          dataType: 'friendProfile',
          isLoggedIn: 1,
          data: {
            name: user.name,
            email: user.email,
            profile: user.profile,
            panelColor: user.panelColor,
            level: user.level,
            reputation: user.reputation,
            role: user.role,
            lastOnline: user.lastOnline,
            lastOnlineLocation: user.lastOnlineLocation,
            wins: user.wins,
            totalPlayed: user.totalPlayed,
            timePlayed: user.timePlayed,
          },
        });
      } else if (req.user?.email === user.email) {
        res.status(200).json({
          status: 'success',
          message: `Sent user's data`,
          dataType: 'yourProfile',
          isLoggedIn: 1,
          data: {
            name: user.name,
            email: user.email,
            profile: user.profile,
            panelColor: user.panelColor,
            level: user.level,
            reputation: user.reputation,
            role: user.role,
            lastOnline: user.lastOnline,
            lastOnlineLocation: user.lastOnlineLocation,
            friends: user.friends,
            notifications: user.notifications,
            wins: user.wins,
            totalPlayed: user.totalPlayed,
            timePlayed: user.timePlayed,
            history: user.history,
          },
        });
      } else if (req.user) {
        res.status(200).json({
          status: 'success',
          dataType: 'userProfile',
          isLoggedIn: 1,
          data: {
            profile: user.profile,
            name: user.name,
            lastOnline: user.lastOnline,
            panelColor: user.panelColor,
            reputation: user.reputation,
            wins: user.wins,
            totalPlayed: user.totalPlayed,
            timePlayed: user.timePlayed,
          },
        });
      } else {
        res.status(200).json({
          status: 'success',
          dataType: 'userProfile',
          isLoggedIn: 0,
          data: {
            profile: user.profile,
            name: user.name,
            lastOnline: user.lastOnline,
            panelColor: user.panelColor,
            reputation: user.reputation,
            wins: user.wins,
            totalPlayed: user.totalPlayed,
            timePlayed: user.timePlayed,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Get friends data ------------------------------------------------------------------------ Get friends data

exports.sendFriendData = async (req, res, next) => {
  try {
    const friends = await User.find({ _id: Object.values(req.user.friends) });

    if (!friends) {
      return next(new UserError('You were supposed to have Kanapkobot', 400));
    }
    res.status(200).json({
      status: 'success',
      message: `Friend's data delivered`,
      data: {
        friends,
      },
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new UserError(`${err.path} invalid`, 400));
    }
    console.log(err);
    next(err);
  }
};

// Getting user list ----------------------------------------------------------------------- Getting user list

let allUsers;
const getDBUsers = async () => {
  try {
    allUsers = await User.find().select({ name: 1, profile: 1 });
    allUsersNames = allUsers.map((el) => {
      return el.name;
    });
  } catch (err) {
    console.log(err);
  }
};
getDBUsers();
setInterval(getDBUsers, (1 / 6) * 60 * 1000);

// Searching users ------------------------------------------------------------------------- Searching users

exports.userList = (req, res, next) => {
  try {
    let matchingNames = [];
    if (req.params.string !== '@') {
      matchingNames = allUsersNames.map((el, i) => {
        if (el.match(req.params.string)) {
          return allUsers[i];
        } else {
          return;
        }
      });
    } else {
      matchingNames = allUsers;
    }

    res.status(200).json(matchingNames);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Adding users ---------------------------------------------------------------------------- Adding users

exports.addFriend = async (req, res, next) => {
  try {
    // Get both users
    // --- Logged in user (inviting)
    const user = req.user;
    // --- Added user (from panel)
    if (req.params.string === 'Kanapkobot') {
      return next(new UserError("You can't invite a bot", 400));
    }
    if (req.params.string === req.user.name) {
      return next(new UserError("You can't invite yourself", 400));
    }
    if (!functions.validateManyCharacters(req.params.string)) {
      return next(
        new UserError('Friend name contains invalid characters', 400)
      );
    }
    const friend = await User.findOne({ name: req.params.string });
    if (!friend) {
      return next(new UserError('User not found', 400));
    }
    if (req.user.friends.includes(friend._id)) {
      return next(new UserError('This person is your friend', 400));
    }
    // Notify user about friend request
    friend.notifications.unshift({
      kind: 'Add friend',
      event: `${user.name}:FriendRequest`,
      content: `${user.name} added you`,
      action: `../api/confirm-friend/${user.name}`,
      image: `profiles/${user.profile}`,
    });
    await friend.save();
    res.status(200).json({
      status: 'success',
      message: `Invitation sent to ${friend.name}`,
    });
  } catch (err) {
    next(err);
  }
};

// Confirming users ------------------------------------------------------------------------ Confirming users

exports.confirmFriend = async (req, res, next) => {
  try {
    const requester = req.params.string;
    if (!requester) {
      return next(new UserError("Enter the sender's name", 400));
    }

    const reqI = req.user.notifications.map((el, i) => {
      return el.event === `${requester}:FriendRequest` ? i : false;
    });
    const reqT = reqI.filter((el) => {
      return typeof el === 'number';
    });

    if (reqT.length < 1) {
      return next(new UserError('Request not found', 400));
    }
    if (!functions.validateManyCharacters(req.params.string)) {
      return next(
        new UserError('Friend name contains invalid characters', 400)
      );
    }
    const inviter = await User.findOne({ name: req.params.string }).select({
      name: 1,
      friends: 1,
    });
    if (!inviter) {
      return next(new UserError('Inviting user not found', 500));
    }

    // Checking for errors
    const indexReciever = req.user.friends.indexOf(inviter._id);
    const indexInviter = inviter.friends.indexOf(req.user._id);

    if (indexReciever !== -1 || indexInviter !== -1) {
      return next(new UserError('You are on your lists', 400));
    }

    req.user.friends.push(inviter._id);
    inviter.friends.push(req.user._id);
    reqT.forEach((el) => {
      req.user.notifications.splice(el, 1);
    });
    await req.user.save();
    await inviter.save();

    res.status(200).json({
      status: 'success',
      message: `Accepted ${inviter.name}'s friend invite`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.removeFriend = async (req, res, next) => {
  try {
    // The one who sent the invitation
    const toRemove = req.params.string;
    if (!toRemove) {
      return next(new UserError('Enter the friends name', 400));
    }
    if (toRemove === 'Kanapkobot') {
      return next(new UserError("You can't remove this bot", 400));
    }
    // The one to accept the invitaiton
    if (!functions.validateManyCharacters(toRemove)) {
      return next(
        new UserError('Friend name contains invalid characters', 400)
      );
    }

    const victim = await User.findOne({ name: toRemove }).select({
      name: 1,
      friends: 1,
    });

    if (!victim) {
      return next(
        new UserError("The user you want to remove was't found", 400)
      );
    }
    const indexInitiatior = req.user.friends.indexOf(victim._id);
    const indexVictim = victim.friends.indexOf(req.user._id);

    if (indexInitiatior === -1 || indexVictim === -1) {
      return next(new UserError("You aren't on your lists", 400));
    }

    req.user.friends.splice(indexInitiatior, 1);
    victim.friends.splice(indexVictim, 1);

    await req.user.save();
    await victim.save();

    res.status(200).json({
      status: 'success',
      message: `Removed ${toRemove} from your friend list (vice versa)`,
    });
  } catch (err) {
    next(err);
  }
};

// Deleting notifications ------------------------------------------------------------------ Deleting notifications

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = req.params.string;
    const reqI = req.user.notifications.map((el, i) => {
      return el.event === `${notification}` ? i : false;
    });
    const reqT = reqI.filter((el) => {
      return typeof el === 'number';
    });
    if (reqT.length < 1) {
      return next(new UserError('Request not found', 400));
    }
    reqT.forEach((el) => {
      req.user.notifications.splice(el, 1);
    });
    await req.user.save();

    res.status(200).json({
      status: 'success',
      message: `Removed ${notification.split(':')[0]}'s ${
        notification.split(':')[1]
      }/s`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Game notifications ---------------------------------------------------------------------- Game notifications

exports.sendGameInvities = async (req, res, next) => {
  try {
    if (!functions.validateManyCharacters(req.body.guest)) {
      return next(
        new UserError('Guests name contains invalid characters', 400)
      );
    }
    const guest = await User.findOne({ name: req.body.guest });
    guest.notifications.unshift({
      kind: `${req.gameKind}`,
      event: `${req.user.name}:${req.gameName}`,
      content: `${req.user.name} ${req.gameText}`,
      action: `${req.gameLink}`,
      image: `profiles/${req.user.profile}`,
    });
    req.user.notifications.unshift({
      kind: `${req.gameKind}`,
      event: `${req.user.name}:${req.gameName}`,
      content: `Join your FIR game with ${guest.name}`,
      action: `${req.gameLink}`,
      image: `profiles/${req.user.profile}`,
    });
    await guest.save();
    await req.user.save();

    res.status(200).json({
      status: 'success',
      message: `Invited ${req.body.guest} to a game of FIR`,
    });
  } catch (err) {
    next(err);
  }
};
