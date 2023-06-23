import bcrypt from 'bcrypt';

export default class User {
    constructor() {
        this.id = null;
        this.username = null;
        this.password = null;
        this.email = null;
        this.created_at = null;
        this.updated_at = null;
        this.firstname = "";
        this.lastname = "";
        this.notes = "";
        this.hidden = "";
        this.role_id = null;
        this.role = null;
        this.token = null;
        this.refreshToken = null;
        this.permissions = [];
    }

    setData(props) {
        for (const prop in props) {
            if(this.hasOwnProperty(prop)) this[prop] = props[prop];
        }
    }

    async encryptPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, 10);
    }
    async comparePasswords(password) {
        if(this.password === null) throw "Password is null";
        return await bcrypt.compare(password, this.password);
    }

    checkPasswordValidity(password) {
        return password === password.trim() && password.length >= process.env.USER_PWD_MIN_LENGTH;
    }

    checkUsernameValidity() {
        return this.username === this.username.trim() && this.username.length >= process.env.USER_NAME_MIN_LENGTH;
    }
}