import { MongoClient } from 'mongodb'

console.log(process.env);

const client = new MongoClient(process.env.MONGO_URL);

export default client;