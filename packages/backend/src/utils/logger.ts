import winston from "winston";

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // new winston.transports.File({ filename: './error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/info.log'}),
  ],
});

logger.on('error', function(err) {
  console.error('logger error', err);
});

logger.on('finish', () => {
  console.log('logger finish');
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
