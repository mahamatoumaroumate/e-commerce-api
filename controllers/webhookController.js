const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Order = require('../models/Order');

module.exports = async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    console.log('🔔 Webhook received');
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('✅ Event constructed:', event.type);
  } catch (err) {
    console.error(`❌ Webhook signature error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('➡️ PaymentIntent ID:', paymentIntent.id);

      const updatedOrder = await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'paid' },
        { new: true }
      );

      if (!updatedOrder) {
        console.warn('⚠️ Order not found for PaymentIntent:', paymentIntent.id);
      } else {
        console.log('✅ Order updated:', updatedOrder._id);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('🔥 Internal webhook handler error:', err);
    res.status(500).send('Internal webhook error');
  }
};
