import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
            mongoose.connection.on('connected', ()=> console.log("Database Connected"));
<<<<<<< HEAD
            await mongoose.connect(`${process.env.MONGODB_URI}/water-well`)
=======
            const dbName = process.env.NODE_ENV === 'test' ? 'water-well-test' : 'water-well';
            await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
    } catch (error) {
        console.log(error.message);
    }
}
export default connectDB;