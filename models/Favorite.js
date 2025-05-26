const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    }
  },
  { timestamps: true }
);

// Prevent duplicate favorites (1 user can favorite a product only once)
FavoriteSchema.index({ user: 1, product: 1 }, { unique: true });


module.exports = mongoose.model('Favorite', FavoriteSchema);
