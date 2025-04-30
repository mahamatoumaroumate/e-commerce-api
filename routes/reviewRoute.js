const express=require('express')
const router=express.Router()
const {authenticateUser,checkPermissions}=require('../middlewares/authentication')
const {createReview,getAllReview,getSingleReview,updateReview,deleteReview}=require('../controllers/reviewController')

router.get('/',authenticateUser,checkPermissions('admin'),getAllReview)
router.post('/',authenticateUser,createReview)
router.get('/:id',authenticateUser,getSingleReview).patch('/:id',authenticateUser,updateReview).delete('/:id',authenticateUser,deleteReview)
module.exports=router