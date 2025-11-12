
import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(404).json({success: false, error: "Token Not Provided"})
        }

        const decode = jwt.verify(token, process.env.JWT_KEY)
        if(!decode){
            return res.status(404).json({success: false, error: "Token Not Valid"})
        }

        const user = await User.findById({_id:decode._id}).select('-password')
        if (!user){
            return res.status(404).json({success: false, error: "User Not Found"})
        }

        req .user = user
        next()
    } catch(error) {
        return res.status(500).json({success: false, error: "server error"})
    }
}

export default verifyUser

