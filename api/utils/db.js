import mongoose from "mongoose"
async function ConnectDB(){
    try {
        const conn=await mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{bufferCommands:false})
        console.log(`MongoDB connected at ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in connection to MongoDB :${error}`)
    }
}

export default ConnectDB;