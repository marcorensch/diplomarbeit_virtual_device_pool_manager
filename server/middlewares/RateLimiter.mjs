import {RateLimiterMemory} from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 1, // per 1 second by IP
})

export default function rateLimiterMiddleware(req, res, next)
{
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => res.status(429).send("Too many requests"))
}