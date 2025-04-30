const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const CustomErrors=require('../errors')
const { attachCookiesToResponse, createUserToken } = require('../utils/jwt')

const register=async(req,res)=>{
    const {email,name,password}=req.body
    if(!email|| !name || !password){
      throw new CustomErrors.BadRequest(`please provide all the values for name , email and password`)
    }
    const user=await User.create({...req.body})
    const userToken=createUserToken({user})
attachCookiesToResponse({res,user:userToken})
    res.status(StatusCodes.CREATED).json({user:userToken})
}
const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new CustomErrors.BadRequest('please provide all the fields, email and password')
    }
    const user=await User.findOne({email})
    if(!user){
        throw new CustomErrors.NotFound(`Sorry there is no user with email :${email}`)
    }
    const isPasswordCorrect=await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomErrors.BadRequest(`invalid credentials, the password did not matched`)
    }
    const userToken=createUserToken({user})
    attachCookiesToResponse({res,user:userToken})
    res.status(StatusCodes.OK).json({user:userToken})
}
const logout=async(req,res)=>{
    res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date(Date.now()+1000)
    })
    res.status(StatusCodes.OK).json({msg:"successfully logout"})
}

module.exports={login,logout,register}