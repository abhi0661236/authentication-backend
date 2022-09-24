import env from 'dotenv';
import jwt from 'jsonwebtoken';

env.config();

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRETKEY, (err, user) => {
            if (err) return reject(err);
            resolve(user);
        });
    });
};


const authenticate = async (req, res, next) => {
    // check if authorization header has been set or not
    // if not, throw an error

    if (!req.headers.authorization) {
        return res.status(400).send({ msg: "Authorization token was not provided or was invalid." });
    }

    // if yes, check availability of bearer token.
    // if not available throw an error.
    if (!req.headers.authorization.startsWith("Bearer ")) {
        return res.status(400).send({ msg: "Authorization token was not provided or was invalid." });
    }

    // if available, split the authorization string and get the second element from the generated array which is the token.
    const token = req.headers.authorization.split(" ")[1];


    // Now we need to verify the token with jwt.
    let user;

    try {
        user = await verifyToken(token);
    } catch (error) {
        return res.status(400).send({ msg: "Authorization token was not provided or was invalid." });
    }

    // now we put the user retrieved from the token in req.user.
    req.user = user.user;

    // return the control to route
    next();
}