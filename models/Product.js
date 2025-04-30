const mongoose = require('mongoose');

// Mapping of main categories to their valid subcategories
const categoryMap = {
  "Women's Fashion": ['Dresses', 'Tops & Tees', 'Jeans', 'Activewear', 'Swimwear'],
  "Men's Fashion": ['Shirts', 'T-Shirts', 'Jeans', 'Activewear', 'Suits'],
  "Electronics": ['Smartphones', 'Laptops', 'Headphones', 'Smart Watches', 'Cameras'],
  "Home & Living": ['Furniture', 'Bedding', 'Home Decor', 'Kitchen', 'Lighting'],
  "Beauty": ['Makeup', 'Skincare', 'Haircare', 'Fragrances'],
  "Kids": ['Clothing', 'Toys', 'Shoes', 'Baby Gear'],
};

const allowedColors = [
  "Black", "White", "Gray", "Blue", "Red", "Green", "Yellow", "Orange",
  "Purple", "Pink", "Brown", "Beige", "Navy", "Maroon", "Olive", "Gold",
  "Silver", "Multicolor"
];

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
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length <= 5;
      },
      message: 'You can provide up to 5 sub images only',
    },
    default: [],
  },
  
  mainCategory: {
    type: String,
    enum: Object.keys(categoryMap),
    required: [true, 'Please select a main category'],
  },
  subCategory: {
    type: String,
    required: [true, 'Please select a subcategory'],
    validate: {
      validator: function (value) {
        const validSubcategories = categoryMap[this.mainCategory] || [];
        return validSubcategories.includes(value);
      },
      message: 'Invalid subcategory for the selected main category',
    },
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
    type: [String],
    enum: {
      values: allowedColors,
      message: '{VALUE} is not a supported color',
    },
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
    next()
  } catch (error) {
    next(error)
  }
})
module.exports = mongoose.model('Product', ProductSchema);
