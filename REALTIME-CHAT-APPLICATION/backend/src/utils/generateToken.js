import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie('jwt', token,{
        maxAge: 15 * 24* 60* 1000, //MS
        httpOnly: true, //ths prevents XSS attacks cross-site scripting attacks
        sameSite:"lax", // allow cookie sharing across localhost ports

        secure: false, // allow cookie over http://localhost
    });
};


export default generateTokenAndSetCookie;