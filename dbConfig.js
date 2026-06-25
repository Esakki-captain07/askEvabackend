import mongoose from "mongoose";
import 'dotenv/config'


const URL = `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
console.log("MONGO URI:", process.env.MONGODB_URI)

mongoose.connect(URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB", err))

export default mongoose