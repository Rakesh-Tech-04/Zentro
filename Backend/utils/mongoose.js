import mongoose from 'mongoose';

export const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to db')
    }
    catch (err) {
        console.log("Error in DB:", err.message)
    }
} 
