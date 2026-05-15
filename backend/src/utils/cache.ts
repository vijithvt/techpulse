import NodeCache from 'node-cache';
import { CACHE_TTL } from '../config';

const cache = new NodeCache({ stdTTL: CACHE_TTL });

export const getCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCache = <T>(key: string, value: T): boolean => {
  return cache.set(key, value);
};

export const clearCache = () => {
  cache.flushAll();
};
