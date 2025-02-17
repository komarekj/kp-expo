import Stripe from 'stripe';

const stripe = new Stripe('sk_test_ExoWPVxXNYhAAxkWzz8jMxi9');

export default async function handler(req, res) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // You might want to get this from the price object
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      priceId: 'plan_G7IfSC25m2YEPK',
    },
  });

  res.status(200).json({ clientSecret: paymentIntent.client_secret });
}