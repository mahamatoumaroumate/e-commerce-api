const CustomErrors=require('../errors')
const { isTokenValid } = require('../utils/jwt')
const authenticateUser=async(req,res,next)=>{
    const token=req.signedCookies.token
    
    if(!token){
        throw new CustomErrors.NotAuthorize('authentication invalid')
    }
    try {
        const {name,userId,role}=isTokenValid({token})
        req.user={name,userId,role}
        // console.log(name,userId,role);
        
        next()
        
    } catch (error) {
        throw new CustomErrors.NotAuthorize('authentication invalid')
        
    }
}

const checkPermissions=(...roles)=>{
    return async(req,res,next)=>{
            if(!roles.includes(req.user.role)){  
                throw  new  CustomErrors.NotAuthorize('Not authorize to access this route') 
            }
            next()
    }
}

module.exports={authenticateUser,checkPermissions}