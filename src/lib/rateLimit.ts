interface RateLimitOptions {
  windowMs: number; // Window duration in ms
  max: number;      // Maximum requests allowed within window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Global in-memory store for rate limiting
const trackers = new Map<string, { count: number; resetTime: number }>();

// Periodic garbage collection every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of trackers.entries()) {
      if (now > val.resetTime) {
        trackers.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { windowMs: 60_000, max: 25 }
): RateLimitResult {
  const now = Date.now();
  const record = trackers.get(key);

  if (!record || now > record.resetTime) {
    trackers.set(key, { count: 1, resetTime: now + options.windowMs });
    return {
      allowed: true,
      remaining: options.max - 1,
      resetTime: now + options.windowMs,
    };
  }

  if (record.count >= options.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.max - record.count,
    resetTime: record.resetTime,
  };
}
