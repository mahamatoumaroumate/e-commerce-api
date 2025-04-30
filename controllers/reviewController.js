const {StatusCodes}=require('http-status-codes')
const CustomErrors=require('../errors')
const Review=require('../models/Review')
const Product=require('../models/Product')
const checkPermission=require('../utils/checkPermission')
const createReview=async(req,res)=>{
    const {product,title,comment}=req.body
    const isValidProduct=await Product.findOne({_id:product})
    if(!isValidProduct){
        throw new CustomErrors.BadRequest(`No product with id : ${product}`)
    }
    const alreadySubmitted=await Review.findOne({product:product,user:req.user.userId})
    if(alreadySubmitted){
        throw new CustomErrors.BadRequest('Already submitted review for this product')
    }
    req.body.user=req.user.userId
    const review=await Review.create({...req.body})
    res.status(StatusCodes.CREATED).json({review})
}
const getAllReview=async(req,res)=>{
    const reviews=await Review.find({})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
const getSingleReview=async(req,res)=>{
    const review=await Review.findOne({_id:req.params.id})
    if(!review){
        throw new CustomErrors.NotFound(`Sorry there is no review found with id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({review})
}
const updateReview=async(req,res)=>{
    const {product,title,comment,rating}=req.body
    if(!product){
        throw new CustomErrors.BadRequest('please provide the product id')
    }
    if(!title || !comment|| !rating){
        throw new CustomErrors.BadRequest('please the title,rating and comment')
    }
    const review=await Review.findOne({_id:req.params.id})
    if(!review){
        throw new CustomErrors.NotFound(`Sorry there is no review found with id : ${req.params.id}`)
    }
    checkPermission(req.user,review.user)
    review.title=title
    review.comment=comment
    review.rating=rating
    await review.save()
    res.status(StatusCodes.OK).json({review})
}
const deleteReview=async(req,res)=>{
    
    const review=await Review.findOne({_id:req.params.id})
    if(!review){
        throw new CustomErrors.NotFound(`Sorry there is no review found with id : ${req.params.id}`)
    }
    checkPermission(req.user,review.user)
    await review.deleteOne()
    res.status(StatusCodes.OK).json({review})
}
const getSingleProductReviews=async(req,res)=>{
    const {id:productId}=req.params
    const reviews=await Review.find({product:productId})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
module.exports={createReview,getAllReview,getSingleReview,updateReview,deleteReview,getSingleProductReviews}