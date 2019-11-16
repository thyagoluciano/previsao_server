const path = require('path');
const { app } = require('../../../server');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

module.exports = app;
