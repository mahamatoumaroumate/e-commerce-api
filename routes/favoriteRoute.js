const express=require('express')
const route=express.Router()
const {addFavorite,deleteFavorite,getUserFavorites}=require('../controllers/favoriteController')
const {authenticateUser,checkPermissions}=require('../middlewares/authentication')
route.get('/',getUserFavorites)
route.post('/',authenticateUser,addFavorite)
route.delete('/:id',authenticateUser,deleteFavorite)
module.exports=route