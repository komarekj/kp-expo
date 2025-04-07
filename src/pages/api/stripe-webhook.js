import Stripe from 'stripe';
import { nanoid } from 'nanoid';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import clientPromise from '../../utils/mongodb.js';
import * as omnisend from '../../utils/omnisend.js';

const EXPO_PRODUCT_IDS = [
  'prod_G7IdBFVqKuotAc',
  'prod_S2pS24wYSP7fbG',
];

export const config = {
  api: {
    bodyParser: false,
  },
};


/**
 * Check for duplicates
 */
const checkDuplicate = async (id, db) => {
  const subscription = await db.collection('subscriptions').findOne({ userId: id });
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
    gift: partner.gift,
    used: false,
  }));

  await db.collection('coupons').insertMany(coupons);
};


/**
 * Validate if purchase contains any of the specified product IDs
 * @param {string} sessionId - Stripe checkout session ID
 * @returns {Promise<boolean>} True if purchase contains matching product
 */
export const validatePurchase = async (sessionId) => {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product']
    });
    
    // Return true if any item matches the specified product IDs
    return lineItems.data.some(item => 
      EXPO_PRODUCT_IDS.includes(item.price?.product?.id)
    );
  } catch (error) {
    console.error('Error validating purchase:', error);
    return false;
  }
};


/**
 * Handle the webhook
 */
export default async function handler(req, res) {
  const rawBody = await buffer(req);

  // Verify if it's a valid event
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Verify if it's the right event
  if (event.type != 'checkout.session.completed') {
    res.status(400).send('Invalid event type');
    return;
  }

  const data = event.data.object;

  // Check if purchase contains any of the specified product IDs
  const isValidPurchase = await validatePurchase(data.id);
  if (!isValidPurchase) {
    res.status(200).send('Not qualified purchase');
    return;
  }

  // Connect DB
  const dbClient = await clientPromise;
  const db = dbClient.db(process.env.MONGO_DB);

  // Check for duplicates
  const isDuplicate = await checkDuplicate(data.id, db);
  if (isDuplicate) {
    res.status(200).send('Duplicate event');
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

  // Signup in Omnisend
  try {
    const { email } = data.customer_details;
    await omnisend.signupUser(email, data.id);
  }  catch (error) {
    console.error('Error signing up user in Omnisend:', error);
  }

  res.status(200).json({ received: true });
}