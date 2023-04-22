export function calculateExpirationMs(duration) {
    if (!duration || !duration.match(/\d+[a-z]$/i)) return 60 * 60 * 1000;
    const count = duration.match(/\d+/)[0];
    const unit = duration.match(/[a-z]$/i)[0];
    if (!count || !unit) return 60 * 60 * 1000;
    switch (unit) {
        case 's':
            return count * 1000;
        case 'm':
            return count * 1000 * 60;
        case 'h':
            return count * 1000 * 60 * 60;
        case 'd':
            return count * 1000 * 60 * 60 * 24;
        case 'w':
            return count * 1000 * 60 * 60 * 24 * 7;
        case 'M':
            return count * 1000 * 60 * 60 * 24 * 30;
        case 'y':
            return count * 1000 * 60 * 60 * 24 * 365;
        default:
            return 60 * 60 * 1000;
    }
}