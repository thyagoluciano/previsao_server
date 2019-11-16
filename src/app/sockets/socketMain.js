const { io } = require('../../../server');
const { gameLogger } = require('../../../logger');
const { CardGameTable, Player } = require('../game/index');

const playersOnLine = {};
const games = {};

setInterval(() => {
  if (Object.keys(playersOnLine).length > 0) {
    io.emit('tock', 'tock');
  }
}, 33);

const login = (userData, socket) => {
  playersOnLine[socket.id] = new Player(socket.id, userData.username);
  gameLogger.info(`User Logged: ${socket.id}`);
  io.emit('newPlayer', playersOnLine[socket.id]);
};

const createGame = (gameOption, socket) => {
  if (games[gameOption.name] === undefined) {
    games[gameOption.name] = new CardGameTable(
      gameOption.name,
      gameOption.quantityRounds,
      gameOption.maxPlayers,
      gameOption.isProtected,
      gameOption.password
    );

    const rooms = [];
    Object.keys(games).forEach(key =>
      rooms.push({
        name: games[key].name,
        isProtected: games[key].isProtected,
        currentRound: games[key].currentRound,
        quantityPlayer: games[key].players.length,
      })
    );
    gameLogger.info(`Create Game: ${rooms}`);
    io.emit('createGame', rooms);
    return;
  }

  gameLogger.info(`Room with that name: ${gameOption.name}, already exists`);
  socket.emit('createRoomError', 'create room error');
};

const joinGame = (roomData, socket) => {
  const { roomId } = roomData;
  const room = games[roomId];

  if (room === undefined) {
    socket.emit('joinRoomError', `The room : ${roomId}, not exist`);
    gameLogger.info(`The room : ${roomId}, not exist`);
    return;
  }

  if (room.isProtected && room.password !== roomData.password) {
    socket.emit('joinRoomError', `Password invalid to ${roomId}`);
    gameLogger.info(`Password invalid to ${roomId}`);
    return;
  }

  if (Object.keys(room.players).length > room.maxPlayers) {
    socket.emit('joinRoomError', `The room is already full: ${roomId}`);
    gameLogger.info(`The room is already full: ${roomId}`);
    return;
  }

  socket.join(roomId);

  if (room.players.find(player => player.id === socket.id) === undefined)
    room.joinGame(playersOnLine[socket.id]);

  io.sockets.in(roomId).emit('newGamePlayer', room.players);
  gameLogger.info(`newGamePlayer: ${room.players}`);
};

const bettingRound = (roomId, index) => {
  io.to(games[roomId].players[index].id).emit(
    'bettingRound',
    games[roomId].players[index]
  );
};

const playCard = (roomId, index) => {
  io.to(games[roomId].players[index].id).emit(
    'playCard',
    games[roomId].players[index]
  );
};

const playerBet = (betData, socket) => {
  const { roomId, bet } = betData;
  const room = games[roomId];
  const playerIndex = room.playerIndex(socket.id);

  if (
    playerIndex === 0 ||
    (playerIndex > 0 && room.players[playerIndex - 1].bet !== null)
  ) {
    room.playerBet(socket.id, bet);
    if (playerIndex === room.players.length - 1) {
      io.sockets.in(roomId).emit('finishedBets', room.getBets());
      playCard(roomId, 0);
      return;
    }
    bettingRound(roomId, playerIndex + 1);
  }
};

const startGame = roomData => {
  const { roomId } = roomData;
  const room = games[roomId];
  room.startGame();
  room.players.forEach(player => {
    io.to(player.id).emit('deck', player.deck);
  });

  bettingRound(roomId, 0);
};

const disconnect = socket => {
  delete playersOnLine[socket.id];
  gameLogger.info(`Disconnected user: ${socket.id} `);
  // TODO: REMOVER USUARIO DESCONECTADO DA SALA
  io.emit('disconnect', 'disconnect');
};

io.sockets.on('connect', socket => {
  gameLogger.info(`new client connected: ${socket.id}`);
  socket.on('login', userData => login(userData, socket));
  socket.on('createGame', gameOption => createGame(gameOption, socket));
  socket.on('joinGame', roomData => joinGame(roomData, socket));
  socket.on('startGame', roomData => startGame(roomData, socket));
  socket.on('playerBet', betData => playerBet(betData, socket));
  socket.on('disconnect', () => disconnect(socket));
});
