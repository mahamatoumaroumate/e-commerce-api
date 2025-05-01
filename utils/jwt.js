const jwt=require('jsonwebtoken')


 const createJWT=({payload})=>{
    const token= jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME
    })
    return token
}

const createUserToken=({user})=>{
    return {name:user.name,email:user.email,userId:user._id,role:user.role}
}

 const attachCookiesToResponse=({res,user})=>{
    const token=createJWT({payload:user})
    const oneDay=1000 * 60 * 60 * 24
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+oneDay),
        secure:process.env.NODE_ENV==='production',
        signed:true
    })
}
const isTokenValid=({token})=>jwt.decode(token,process.env.JWT_SECRET)
module.exports={isTokenValid,attachCookiesToResponse,createJWT,createUserToken}