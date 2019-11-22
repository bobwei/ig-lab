function withCache(storage, key, fn) {
  return async (...args) => {
    const cache = await storage.getItem(key);
    if (cache) {
      return JSON.parse(cache);
    }
    const result = await fn(...args);
    await storage.setItem(key, JSON.stringify(result, null, 2));
    return result;
  };
}

export default withCache;
