const { createLogger, format, transports, config } = require('winston');

const { combine, timestamp, json } = format;

const gameLogger = createLogger({
  levels: config.syslog.levels,
  defaultMeta: { component: 'Previsão Server' },
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    json()
  ),
  transports: [new transports.Console()],
});

module.exports = {
  gameLogger,
};
