import bcrypt from 'bcrypt';
export default class User {
    constructor() {
        this.id = null;
        this.username = null;
        this.password = null;
        this.notes = null;
        this.hidden = null;
        this.role = null;
    }

    async checkPassword(password) {
        const match = await bcrypt.compare(password, this.password);
        console.log("Match:", match)
        return match;
    }
}