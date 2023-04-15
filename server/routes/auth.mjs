import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";

const router = express.Router();

router.post('/login', UserValidator.validate, async (req, res) => {

    res.cookie('nxd-token', req.user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: calculateExpirationMs(process.env.JWT_EXPIRATION)
    })

    res.cookie('nxd-refresh-token', req.user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: calculateExpirationMs(process.env.JWT_REFRESH_EXPIRATION)
    })

    res.status(200).json({token: req.user.token, message: 'Login successful'});

})

function calculateExpirationMs(string) {
    if(!string) return 0;
    const unit = string.slice(-1);
    const value = parseInt(string.slice(0, -1));
    switch (unit) {
        case 's':
            return value * 1000;
        case 'm':
            return value * 1000 * 60;
        case 'h':
            return value * 1000 * 60 * 60;
        case 'd':
            return value * 1000 * 60 * 60 * 24;
        default:
            return value;
    }
}

export default router;