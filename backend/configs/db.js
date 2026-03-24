import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
            mongoose.connection.on('connected', ()=> console.log("Database Connected"));
            const dbName = process.env.NODE_ENV === 'test' ? 'water-well-test' : 'water-well';
            await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
    } catch (error) {
        console.log(error.message);
    }
}
export default connectDB;