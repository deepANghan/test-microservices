import { WINDOW_RATE_LIMIT_CONFIG, TOKEN_BUCKET_RATE_LIMIT_CONFIG } from "./rate-limit-config.js";

export class ClientWindow {

    requestCount: number;
    windowStartTime: number;

    constructor() {
        this.requestCount = 0;
        this.windowStartTime = Date.now();
    }

    updateCount() {

        let now = Date.now();

        if ((now - this.windowStartTime) > WINDOW_RATE_LIMIT_CONFIG.WINDOW_SIZE) {
            this.requestCount = 0;
            this.windowStartTime = now;
        }

        if (this.requestCount >= WINDOW_RATE_LIMIT_CONFIG.REQUEST_COUNT) {
            return false;
        }

        this.requestCount++;

        return true;
    }
}

export class ClientBucket {

    tokens: number;
    lastRefillAt: number;

    constructor() {
        this.tokens = TOKEN_BUCKET_RATE_LIMIT_CONFIG.MAX_TOKENS;
        this.lastRefillAt = Date.now();
    }

    consumeToken() {

        let now = Date.now();

        let diff = (now - this.lastRefillAt) / 1000;

        let newTokens = diff * TOKEN_BUCKET_RATE_LIMIT_CONFIG.REFILL_RATE;

        this.tokens = Math.min(this.tokens + newTokens, TOKEN_BUCKET_RATE_LIMIT_CONFIG.MAX_TOKENS);

        this.lastRefillAt = now;

        if (this.tokens < 1) {
            return false;
        }

        this.tokens--;

        return true;
    }


}
