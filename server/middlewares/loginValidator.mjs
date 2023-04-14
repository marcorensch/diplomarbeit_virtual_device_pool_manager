export default class LoginValidator {
    static async validate(req, res, next) {
        console.log(req.params)
        let {username, password} = req.body;
        if(!username || !password) return res.status(400).send("Username or password missing");
        console.log(username, password)
        const user = {name:'test', id:1, role:'admin'}
        if(!user) return res.status(400).send("User not found");
        // if(!user.checkPassword(password)) return res.status(401).json(new ApiError('u-332'));

        req.user = user;
        next();
    }
}