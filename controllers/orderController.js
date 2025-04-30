const {StatusCodes}=require('http-status-codes')
const CustomErrors=require('../errors')
const Order=require('../models/Order')
const checkPermission=require('../utils/checkPermission')
// stripe.js or at the top of your controller
const Stripe = require('stripe');
const Product=require('../models/Product')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // make sure this is set in your .env

const createPaymentIntent = async ({ amount, currency }) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe uses the smallest currency unit
        currency,
    });
    return paymentIntent;
};

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new CustomErrors.BadRequest('No cart Items Provided');
    }
    if (tax == null || shippingFee == null) {
        throw new CustomErrors.BadRequest('Please provide tax and shipping fee');
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomErrors.NotFoundError(`No product with id : ${item.product}`);
        }
        const { name, price, mainImage, _id } = dbProduct;

        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            product: _id,
            image:mainImage
        };

        orderItems.push(singleOrderItem);
        subtotal += item.amount * price;
    }

    const total = tax + subtotal + shippingFee;

    const paymentIntent = await createPaymentIntent({ amount: total, currency: 'usd' });

    const order = await Order.create({
        orderItems, // ✅ Correct field name
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        stripePaymentIntentId: paymentIntent.id,
        user: req.user.userId
      });
      

    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
};

const getAllOrders=async(req,res)=>{
   const orders=await Order.find({})
   res.status(StatusCodes.OK).json({orders,count:orders.length})
   
}
const getSingleOrder=async(req,res)=>{
    const order=await Order.findOne({_id:req.params.id})
    if(!order){
        throw new CustomErrors.NotFound(`No Order with id : ${req.params.id}`)
    }
    checkPermission(req.user,order.user)
    res.status(StatusCodes.OK).json({order})
}
const updateOrder=async(req,res)=>{
    const {status}=req.body
    if(!status){
        throw new CustomErrors.BadRequest(`please provide the status`)
    }
    const order=await Order.findOne({_id:req.params.id})
    if(!order){
        throw new CustomErrors.NotFound(`No Order found with id : ${req.params.id}`)
    }
    checkPermission(req.user,order.user)
    order.status=status
    await order.save()
    res.status(StatusCodes.OK).json({msg:"successfully update order",order})
}
const getCurrentUserOrders=async(req,res)=>{
    const orders=await Order.find({user:req.user.userId})
    if(!orders){
        throw new CustomErrors.NotFound(`No Order from this  user : ${req.user.userId}`)
    }
    res.status(StatusCodes.OK).json({orders,count:orders.length})
}

module.exports={createOrder,getAllOrders,getCurrentUserOrders,getSingleOrder,updateOrder}