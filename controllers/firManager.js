const FIRG = require("../games/fourInRowGame");
const path = require("path");

let games = {};

const createGameFunc = (room, host, guest) => {
  games[room] = new FIRG(host, guest);
  return room;
};

exports.startScreen = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../pages/createGameFIR4.html"));
};

exports.createGame = (req, res, next) => {
  const host = req.body.host;
  const guest = req.body.guest;
  const room = createGameFunc(req.body.room, host, guest);
  res.json({
    message: `${room} room has been created. Go to <a href="/fir/${room}">/fir/${room}</a> to play with ${guest}`,
  });
};

exports.gameScreen = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../pages/FIR4.html"));
};

exports.game = (req, res, next) => {
  const field = req.body.field;
  const player = req.body.player;
  const room = req.params.room;

  const currentGame = games[room];
  if (!currentGame) {
    return res.json({
      message: "Room doesn't exist (misspelled or server restart)",
      status: 0,
    });
  }
  const gameRes = currentGame.markField(field, player);
  res.json({
    data: gameRes,
  });
};

exports.refresh = (req, res, next) => {
  const room = req.params.room;
  const currentGame = games[room];

  if (!currentGame) {
    return res.json({
      message: "Room doesn't exist (misspelled or server restart)",
      status: 0,
    });
  }
  const gameRes = currentGame?.fields;
  const winner = currentGame.winner;
  res.json({
    winner: winner,
    host: currentGame.host,
    guest: currentGame.guest,
    last: currentGame.lastPlayer,
    data: gameRes,
  });
};

exports.reset = (req, res, next) => {
  const currentGame = games[req.params.room];

  if (!currentGame) {
    return res.json({
      message: "Room doesn't exist (misspelled or server restart)",
      status: 0,
    });
  }

  const gameRes = currentGame.reset(req.body.player);
  res.json({
    data: gameRes,
  });
};
