const express=require('express')
const route=express.Router()
const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword,deleteUser}=require('../controllers/userController')
const {authenticateUser,checkPermissions}=require('../middlewares/authentication')

route.get('/',authenticateUser,checkPermissions('admin'),getAllUsers)
route.get('/showMe',authenticateUser,showCurrentUser)
route.patch('/updateUser',authenticateUser,updateUser)
route.patch('/updateUserPassword',authenticateUser,updateUserPassword)
route.get('/:id',authenticateUser,getSingleUser).delete('/:id',deleteUser)
module.exports=route
