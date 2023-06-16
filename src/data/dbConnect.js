import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()
const dbUri = process.env.DBURI 
export const connection = async () => {
  await  mongoose.connect(dbUri,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
}
mongoose.connection.on('connected', () => {
    console.log('lista la connexion a mongodb');
})


mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  
mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  }); 