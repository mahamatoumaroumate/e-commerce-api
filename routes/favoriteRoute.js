const express=require('express')
const route=express.Router()
const {addFavorite,deleteFavorite,getUserFavorites}=require('../controllers/favoriteController')
const {authenticateUser,checkPermissions}=require('../middlewares/authentication')
route.post('/',authenticateUser,addFavorite)
route.get('/',authenticateUser,getUserFavorites)
route.delete('/:id',authenticateUser,deleteFavorite)
module.exports=route