const CustomErrors=require('../errors')
const {StatusCodes}=require('http-status-codes')
const Product=require('../models/Product')
const cloudinary=require('cloudinary').v2
const fs=require('fs')
const createProduct=async(req,res)=>{
    req.body.user=req.user.userId
    const product=await Product.create({...req.body})
    res.status(StatusCodes.CREATED).json({product})
}
const getAllProduct=async(req,res)=>{
    const products=await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length})
}
const getSingleProduct=async(req,res)=>{
    const product=await Product.findOne({_id:req.params.id})
    if(!product){
        throw new CustomErrors.NotFound(`Sorry no product found with this id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({product})
}
const updateProduct=async(req,res)=>{
    const product=await Product.findOneAndUpdate({_id:req.params.id},req.body,{runValidators:true,new:true})
    if(!product){
        throw new CustomErrors.NotFound(`Sorry no product found with this id : ${req.params.id}`)

    }
    res.status(StatusCodes.OK).json({product,msg:"successfully updated product"})
}
const deleteProduct=async(req,res)=>{
    const product=await Product.findOneAndDelete({_id:req.params.id})
    if(!product){
        throw new CustomErrors.NotFound(`Sorry no product found with this id : ${req.params.id}`)

    }
    res.status(StatusCodes.OK).json({msg:"successfully deleted product"})
}
const uploadImage=async(req,res)=>{
    const result=await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename:true,
            folder:'e-commerce-api'
        }
    )
    
    fs.unlinkSync(req.files.image.tempFilePath)
  return  res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
}
// DELETE /api/delete-image
const deleteImage=async( req, res) => {
 const { imageUrl } = req.body;
const extractPublicId = (url) => {
  const match = url.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
};

const publicId = extractPublicId(imageUrl);
if (!publicId) {
  throw new CustomErrors.BadRequest("Invalid Cloudinary image URL");
}

const result = await cloudinary.uploader.destroy(publicId);
if (result.result !== 'ok') {
  throw new CustomErrors.NotFound(`There is no image with this publicId: ${publicId}`);
}

res.status(200).json(result);
};

module.exports={createProduct,getAllProduct,getSingleProduct,deleteProduct,updateProduct,uploadImage,deleteImage}