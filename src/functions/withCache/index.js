function withCache(storage, key, fn) {
  return async (...args) => {
    const cache = await storage.getItem(key);
    if (cache) {
      return JSON.parse(cache).data;
    }
    const result = await fn(...args);
    await storage.setItem(key, JSON.stringify(createRes(result), null, 2));
    return result;
  };
}

function createRes(data) {
  return {
    data,
    createdAt: new Date().toISOString(),
  };
}

export default withCache;
