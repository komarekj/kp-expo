import Stripe from 'stripe';
import { nanoid } from 'nanoid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import dbClient from './utils/mongodb';

/**
 * Check for duplicates
 */
const checkDuplicate = async (id, db) => {
  const subscription = await db.collection('subscriptions').findOne({ id: id });
  return subscription ? true : false;
};

/**
 * Create discounts for the subscription
 */
const createeCoupons = async (id, db) => {
  const partners = await db.collection('partners').find({ active: true }).toArray();

  const coupons = partners.map((partner) => ({
    userId: id,
    partnerId: partner._id,
    partner: partner.name,
    info: partner.info,
    instructions: partner.instructions,
    discount: partner.discount,
    logo: partner.logo,
    code: `${partner.prefix}-${nanoid(5).toUpperCase()}`,
    premium: partner.premium,
    used: false,
  }));

  await db.collection('coupons').insertMany(coupons);
};


/**
 * Handle the webhook
 */
export default async function handler(req, res) {
  console.log(req.body);
  const data = req.body;

  // Verify if it's the right event
  if (data.object != 'checkout.session') {
    res.status(400).send('Invalid event type');
    return;
  }

  // Verify if it's a valid event
  // try {
  //   const event = stripe.webhooks.constructEvent(
  //     req.body,
  //     req.headers['stripe-signature'],
  //     process.env.STRIPE_WEBHOOK_SECRET
  //   );
  // } catch (err) {
  //   res.status(400).send(`Webhook Error: ${err.message}`);
  //   return;
  // }

  // Connect DB
  await dbClient.connect();
  const db = dbClient.db(process.env.MONGO_DB);

  // Check for duplicates
  const isDuplicate = await checkDuplicate(data.id, db);
  if (isDuplicate) {
    res.status(400).send('Duplicate event');
    return;
  }

  // Create subscription object
  const subscription = {
    userId: data.id,
    created: new Date(data.created * 1000),
    subscription: data.subscription,
    customer: data.customer,
    customerDetails: data.customer_details,
  };

  await db.collection('subscriptions').insertOne(subscription);

  // Create discounts
  await createeCoupons(data.id, db);

  // Close DB
  await dbClient.close();

  res.status(200).json({ received: true });
}