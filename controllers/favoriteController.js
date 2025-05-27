const addFavorite = async (req, res) => {
  const { user, product } = req.body;
  if (!user || !product) {
    throw new CustomErrors.BadRequest('Please provide both user and product');
  }

  const dbProduct = await Product.findOne({ _id: product });
  if (!dbProduct) {
    throw new CustomErrors.NotFound(`No product found with id: ${product}`);
  }

  const favorite = await Favorite.create({ user, product });
  await favorite.populate('product');
  
  res.status(StatusCodes.OK).json({ favorite, msg: 'Successfully added favorite' });
};

const deleteFavorite = async (req, res) => {
  const { user, product } = req.query;
  if (!user || !product) {
    throw new CustomErrors.BadRequest('Please provide both user and product');
  }

  const dbProduct = await Product.findOne({ _id: product });
  if (!dbProduct) {
    throw new CustomErrors.NotFound(`No product found with id: ${product}`);
  }

  const favorite = await Favorite.findOneAndDelete({
    _id: req.params.id,
    user,
    product,
  });

  if (!favorite) {
    throw new CustomErrors.NotFound('Favorite not found');
  }

  res.status(StatusCodes.OK).json({ favorite, msg: 'Successfully deleted favorite' });
};

const getUserFavorites = async (req, res) => {
  const { user } = req.query;
  const favorites = await Favorite.find({ user }).populate('product');
  res.status(StatusCodes.OK).json(favorites);
};

module.exports = { addFavorite, deleteFavorite, getUserFavorites };
