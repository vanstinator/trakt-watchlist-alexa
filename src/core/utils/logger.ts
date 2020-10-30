import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'trace',
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    messageFormat: '{levelLabel} {module} {msg}',
    translateTime: true,
    ignore: 'level,module,pid,hostname'
  }
});

logger.category = (name: string) => {
  return logger.child({ module: `[${name}]` });
};

export default logger;