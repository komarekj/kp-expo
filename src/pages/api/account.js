import dbClient from './utils/mongodb';

export default async function handler(req, res) {
  const { id } = req.body;

  try {
    // Connect DB
    await dbClient.connect();
    const db = dbClient.db(process.env.MONGO_DB);

    // Find the account coupons
    const coupons = await db.collection('coupons').find({ userId: id }).toArray();

    if (coupons.length === 0) {
      res.status(400).json({ error: 'Coupons not found' });
      return;
    }

    res.status(200).json({ coupons });
  } finally {
    // Close the connection
    await dbClient.close();
  }
}