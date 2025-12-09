class SimpleCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  set(key, value) {
    const record = {
      value,
      expiresAt: Date.now() + this.ttlMs
    };
    this.store.set(key, record);
  }

  get(key) {
    const record = this.store.get(key);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return record.value;
  }

  clear() {
    this.store.clear();
  }
}

export const cacheService = new SimpleCache(5 * 60 * 1000); // default 5 mins
