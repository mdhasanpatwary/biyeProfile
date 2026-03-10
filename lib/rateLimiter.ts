/**
 * Simple in-memory rate limiter for MVP use.
 * Tracks requests per IP within a rolling time window.
 */

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitTracker>();

export class RateLimiter {
  private limit: number;
  private windowMs: number;

  /**
   * @param limit Max requests per window
   * @param windowMs Time window in milliseconds
   */
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Checks if the given IP has exceeded the rate limit.
   * @param ip The client IP address
   * @returns { success: boolean, limit: number, remaining: number, reset: number }
   */
  public check(ip: string) {
    const now = Date.now();
    const record = store.get(ip);

    // If no record or the window expired, start fresh
    if (!record || now > record.resetTime) {
      store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });

      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: now + this.windowMs,
      };
    }

    // Window hasn't expired, increment count
    record.count++;
    store.set(ip, record);

    const remaining = Math.max(0, this.limit - record.count);

    return {
      success: record.count <= this.limit,
      limit: this.limit,
      remaining,
      reset: record.resetTime,
    };
  }

  /**
   * Optional: Clear memory of expired records (prevent memory leaks over time)
   * This is lightweight enough to run occasionally.
   */
  public static cleanup() {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(ip);
      }
    }
  }
}
