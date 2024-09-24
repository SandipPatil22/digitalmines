import mongoose from 'mongoose'

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`\n Mongodb Connected `)
    } catch (error)
    {
        console.log("mongoDb error : ", error)
        process.exit(1)
    }
}

export default connectDB