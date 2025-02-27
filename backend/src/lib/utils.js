import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, {
        maxAge: 604800000, // 7 days
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'production', // Only set secure cookies in production
        domain: 'localhost', // Make sure this matches the frontend domain
        path: '/'
    });
    return token;
};

export default generateToken;