import mongoose from "mongoose";
async function ConnectDB() {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://ezeeblitzcart:ankit123@ankit-mongodb-atlas.y44n4.mongodb.net/ezeeblitz?retryWrites=true&w=majority&appName=ANKIT-MONGODB-ATLAS",
      { bufferCommands: false }
    );
    console.log(`MongoDB connected at ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in connection to MongoDB :${error}`);
  }
}

export default ConnectDB;
