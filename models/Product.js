const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the product name'],
    minlength: [3, 'Product name cannot be less than 3 characters'],
    maxlength: [30, 'Product name cannot be greater than 30 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price value'],
  },
  description: {
    type: String,
    required: [true, 'Please provide the description value'],
    minlength: [30, 'Product description cannot be less than 30 characters'],
    maxlength: [200, 'Product description cannot be greater than 200 characters'],
  },
  mainImage: {
    type: String,
    required: [true, 'Please provide the main image URL'],
  },
  subImages: {
    type: [String], // array of image URLs
    required:[true , 'please provide the subImages']
  },
  
  mainCategory: {
    type: String,
    required: [true, 'Please select a main category'],
  },
  subCategory: {
    type: String,
    required: [true, 'Please select a subcategory'],
  },
  featured: {
    type: Boolean,
    default: false
  },
  freeShipping: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: ['White'],
    required: [true, 'Please provide the value for color']
  },
  averageRating: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });
ProductSchema.virtual('reviews',{
  ref:'Review',
  localField:'_id',
  foreignField:'product',
  justOne:false
})

ProductSchema.pre('deleteOne',{document:true,query:false},async function(next){
  try {
    await this.model('Review').deleteMany({product:this._id})
    await this.model('Favorite').deleteMany({ product: this._id });
    next()
  } catch (error) {
    next(error)
  }
})
module.exports = mongoose.model('Product', ProductSchema);
