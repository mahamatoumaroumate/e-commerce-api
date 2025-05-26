const express=require('express')
const route=express.Router()
const {getAllUsers,getUserFavorites,getSingleUser,showCurrentUser,updateUser,updateUserPassword,deleteUser}=require('../controllers/userController')
const {authenticateUser,checkPermissions}=require('../middlewares/authentication')

route.get('/',authenticateUser,checkPermissions('admin'),getAllUsers)
route.get('/showMe',authenticateUser,showCurrentUser)
route.patch('/updateUser',authenticateUser,updateUser)
route.patch('/updateUserPassword',authenticateUser,updateUserPassword)
route.get('/favorites',authenticateUser,getUserFavorites)
route.get('/:id',authenticateUser,getSingleUser).delete('/:id',authenticateUser,checkPermissions('admin'),deleteUser)
module.exports=route
