import clientPromise from '../../utils/mongodb';

import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.body;
  const couponId = ObjectId.createFromHexString(id);

  // Connect DB
  const dbClient = await clientPromise;
  const db = dbClient.db(process.env.MONGO_DB);

  // Find the coupon
  const coupon = await db.collection('coupons').findOne({ _id: couponId });
  if (!coupon) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }

  // Check if the coupon is used
  if (coupon.used) {
    res.status(400).json({ error: 'Coupon already used' });
    return;
  }

  // Update the coupon
  await db.collection('coupons').updateOne({ _id: couponId }, { $set: { used: true } });

  // Close the connection
  // await dbClient.close();

  res.status(200).json({ success: true });
}