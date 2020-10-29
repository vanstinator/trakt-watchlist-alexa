import pino from 'pino';

const rootLogger = pino({
  level: process.env.LOG_LEVEL || 'trace',
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    messageFormat: '{levelLabel} {module} {msg}',
    translateTime: true,
    ignore: 'level,module,pid,hostname'
  }
});

rootLogger.category = (name: string) => {
  return rootLogger.child({ module: `[${name}]` });
};

export default rootLogger;