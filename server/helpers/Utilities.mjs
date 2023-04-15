export function calculateExpirationMs(string) {
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