const Favorite=require('../models/Favorite')
const Product=require('../models/Product')
const CustomErrors=require('../errors')
const {StatusCodes}=require('http-status-codes')
const addFavorite=async(req,res)=>{
    const {user,product}=req.body
    if(!user || !product){
        throw new CustomErrors.BadRequest('please provide all the values user and product')
    }
    const dbProduct=await Product.find({_id:product})
    if(!dbProduct)throw new CustomErrors.NotFound(`Sorry no product found with id : ${product}`)
    const favorite=await Favorite.create({user,product})
    res.status(StatusCodes.OK).json({favorite,msg:'successfully added favorite'})
}
const deleteFavorite=async(req,res)=>{
    const {user,product}=req.body
    if(!user || !product){
        throw new CustomErrors.BadRequest('please provide all the values user and product')
    }
    const dbProduct=await Product.find({_id:product})
    if(!dbProduct)throw new CustomErrors.NotFound(`Sorry no product found with id : ${product}`)
    const favorite=await Favorite.findOneAndDelete({_id:req.params.id,user,product})
    res.status(StatusCodes.OK).json({favorite,msg:'successfully deleted favorite'})
}
const getUserFavorites = async (req, res) => {
 const {user}=req.body
    const favorites = await Favorite.find({ user: user}).populate('product');
    res.status(StatusCodes.OK).json(favorites);
  
};

module.exports={addFavorite,deleteFavorite,getUserFavorites}