import { env } from '@/config/env';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const formatMessage = (level: LogLevel, message: string, meta?: object): string => {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] ${level}: ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

export const logger = {
  info: (message: string, meta?: object) => {
    console.log(formatMessage('INFO', message, meta));
  },

  warn: (message: string, meta?: object) => {
    console.warn(formatMessage('WARN', message, meta));
  },

  error: (message: string, meta?: object) => {
    console.error(formatMessage('ERROR', message, meta));
  },

  debug: (message: string, meta?: object) => {
    if (env.NODE_ENV !== 'production') {
      console.log(formatMessage('DEBUG', message, meta));
    }
  },
};
