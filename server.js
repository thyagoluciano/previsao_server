const express = require('express');
const helmet = require('helmet');
const socketio = require('socket.io');

const app = express();

app.use(express.static(`${__dirname}/src/public`));
app.use(helmet());

const expressServer = app.listen(process.env.PORT || 3000);
const io = socketio(expressServer);

module.exports = {
  app,
  io,
};
