import env from 'dotenv';
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';

env.config();

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users: users });
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
}

export const signup = async (req, res) => {
    // destructuring all the fields from request body
    const { name, email, password } = req.body;

    // ensuring none of the field is empty
    if (!name || !email || !password) {
        return res.status(401).json({ msg: "Please fill each fields." });
    }


    // checking whether user exist
    const userExist = await User.findOne({ email: email });
    if (userExist) {
        return res.status(400).json({ msg: "An user already exists with the same email id." });
    }

    // create a new instance of User Schema
    const user = new User({
        name: name,
        email: email,
        password: password
    });

    // Now before saving the data in database we need to hash the password see usermodel.
    const userSaved = await user.save(); // that's it.
    // console.log(userSaved);


}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ensuring none of the field is empty
        if (!email || !password) {
            return res.status(401).json({ msg: "Please fill each fields." });
        }

        // checking whether user exist
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // check with saved password
        const isPasswordCorrect = foundUser.checkPassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).send({ msg: "Invalid email or password" })
        }

        // if the password is correct then we create a token for the user
        const token = jwt.sign({ foundUser }, process.env.SECRETKEY);

        // send the token along with the user in response
        // then return the token to the user
        return res.status(201).send({ foundUser, token })
    } catch (error) {
        return res.send(error.message)
    }

}