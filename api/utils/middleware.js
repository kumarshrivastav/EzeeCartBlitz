import tokenService from "../services/token.service.js"

function verifyToken(req,res,next){
    try {
        const {user}=tokenService.verifyAccessToken(req?.cookies?.accessToken)
        req.userId=user._id
        user?.isAdmin ? req.isAdmin=true :req.isAdmin=false
        next()
    } catch (error) {
        next(error)
    }
}

export default verifyToken