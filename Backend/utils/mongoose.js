import mongoose from 'mongoose';

export const main = async () => {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => { console.log('Connected to db') })
        .catch(() => { console.log('Something wrong to connect db') })
} 
