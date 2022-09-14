const FIRG = require('../games/fourInRowGame');
const User = require('../models/userModel');

const UserError = require('../utils/UserError');
const functions = require('../utils/functions');

let games = {};

const createGameFunc = (room, host, guest) => {
  games[room] = new FIRG(host, guest);
  return room;
};

const removeNotifications = (notification, user) => {
  const reqI = user.notifications.map((el, i) => {
    return el.event === `${notification}` ? i : false;
  });
  const reqT = reqI.filter((el) => {
    return typeof el === 'number';
  });
  if (reqT.length < 1) {
    console.log('No notification found');
  }
  reqT.forEach((el) => {
    user.notifications.splice(el, 1);
  });
};

const updatePlayersStats = async (currentGame) => {
  const winner = currentGame.winner;
  const host = currentGame.host;
  const guest = currentGame.guest;
  if (!functions.validateManyCharacters(host)) {
    return next(new UserError('Host name contains invalid characters', 400));
  }
  if (!functions.validateManyCharacters(guest)) {
    return next(new UserError('Guest name contains invalid characters', 400));
  }
  const [hostProfile, guestProfile] = await User.find({
    name: [guest, host],
  }).select({
    name: 1,
    wins: 1,
    totalPlayed: 1,
    notifications: 1,
  });
  hostProfile.totalPlayed++;
  guestProfile.totalPlayed++;
  if (winner === hostProfile.name) {
    hostProfile.wins = hostProfile.wins + 1;
  } else if (winner === guestProfile.name) {
    guestProfile.wins = guestProfile.wins + 1;
  }
  removeNotifications(`${host}:FIR`, hostProfile);
  removeNotifications(`${host}:FIR`, guestProfile);

  await hostProfile.save();
  await guestProfile.save();

  currentGame.winner = '';
};

exports.play = (req, res, next) => {
  const field = req.body.field;
  const player = req.user.name;
  const room = req.params.string;

  const currentGame = games[room];
  if (!currentGame) {
    return next(new UserError(`Game doesn't exist`, 500));
  }
  if (field) {
    currentGame.markField(field, player);
  }
  const gameRes = {};
  gameRes.currentPlayer = currentGame.currentPlayer;
  gameRes.host = currentGame.host;
  gameRes.hostRep = currentGame.hostRep;
  gameRes.guest = currentGame.guest;
  gameRes.guestRep = currentGame.guestRep;
  gameRes.fields = currentGame.fields;
  gameRes.hostProfile = currentGame.hostProfile;
  gameRes.guestProfile = currentGame.guestProfile;
  gameRes.winner = currentGame.winner;
  gameRes.guestColor = currentGame.guestColor;
  gameRes.hostColor = currentGame.hostColor;

  if (!currentGame.winner) {
    res.status(200).json({
      status: 'success',
      message: 'Sent response',
      data: gameRes,
    });
  } else {
    updatePlayersStats(currentGame);
    res.status(200).json({
      status: 'success',
      message: 'Game ended',
      data: gameRes,
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    const host = req.user.name;
    const guest = req.body.guest;
    const gameId = req.params.string;

    if (games[gameId]) {
      return next(new UserError('Please try again', 500));
    }
    if (!functions.validateManyCharacters(req.body.guest)) {
      return next(new UserError('Guest name contains invalid characters', 400));
    }
    const guestProfile = await User.findOne({ name: req.body.guest }).select({
      reputation: 1,
      profile: 1,
      wins: 1,
      totalPlayed: 1,
      panelColor: 1,
    });

    if (!guestProfile) {
      return next(new UserError(`Guests profile doesn't exist`, 500));
    }

    const room = createGameFunc(gameId, host, guest);
    games[room].hostRep = req.user.reputation;
    games[room].guestRep = guestProfile.reputation;

    games[room].guestProfile = guestProfile.profile;
    // games[room].guestColor = guestProfile.panelColor;
    games[room].guestColor = '255000000';
    games[room].hostProfile = req.user.profile;
    // games[room].hostColor = req.user.panelColor;
    games[room].hostColor = '000000255';

    req.gameLink = `/play/${gameId}`;
    req.gameName = `FIR`;
    req.gameKind = `Game Invitation`;
    req.gameText = `invited you to a game of FIR`;

    req.gameData = {
      host: host,
      guest: guest,
      hostRep: room.hostRep,
      guestRep: room.guestRep,
      currentPlayer: room.currentPlayer,
    };

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
