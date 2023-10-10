import mongoose, { Connection, Mongoose } from 'mongoose';
import colors from 'colors';

export const connectToDatabase = async (): Promise<Connection> => {
  const { DATABASE_URI } = <Record<string, string>>process.env;
  const { connection } = await mongoose.connect(DATABASE_URI);
  console.log(`MongoDM connected: ${connection.host}`.green.bold)
  return connection;
};