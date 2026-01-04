/**
 * Simple in-memory token-bucket rate limiter per admin key.
 * Not distributed — suitable for single-instance dev/test usage.
 * Configurable via AI_GENERATION_RATE_LIMIT_PER_MIN env var (default 6 per minute).
 */

const LIMIT_PER_MIN = parseInt(process.env.AI_GENERATION_RATE_LIMIT_PER_MIN || '6', 10);
const REFILL_INTERVAL_MS = 60 * 1000;

const buckets = new Map(); // adminKey -> { tokens, lastRefill }

function maskAdminKey(key) {
  if (!key) return '';
  if (key.length <= 8) return '****' + key.slice(-4);
  return key.slice(0, 2) + '****' + key.slice(-4);
}

function allowRequest(adminKey) {
  const now = Date.now();
  let bucket = buckets.get(adminKey);
  if (!bucket) {
    bucket = { tokens: LIMIT_PER_MIN, lastRefill: now };
    buckets.set(adminKey, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed > 0) {
    const refill = Math.floor(elapsed / REFILL_INTERVAL_MS) * LIMIT_PER_MIN;
    if (refill > 0) {
      bucket.tokens = Math.min(LIMIT_PER_MIN, bucket.tokens + refill);
      bucket.lastRefill = now;
    }
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { ok: true, remaining: bucket.tokens };
  }

  return { ok: false, remaining: 0 };
}

module.exports = (req, res, next) => {
  const adminKey = req.headers['x-admin-api-key'] || '';
  const masked = maskAdminKey(adminKey);

  const result = allowRequest(adminKey);
  if (!result.ok) {
    res.status(429).json({ msg: 'Rate limit exceeded for AI quiz generation. Try again later.' });
    console.warn(`AI generation rate-limited for admin ${masked}`);
    return;
  }

  // attach some diagnostic info
  req.rateLimitInfo = { remaining: result.remaining, adminKeyMasked: masked };
  next();
};