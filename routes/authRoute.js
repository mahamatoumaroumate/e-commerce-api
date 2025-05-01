const express=require('express')
const route=express.Router()
const {login,logout,register,verify}=require('../controllers/authController')
const {authenticateUser}=require('../middlewares/authentication')
route.post('/register',register)
route.post('/login',login)
route.get('/logout',logout)
route.get('/verify',authenticateUser,verify)
module.exports=route