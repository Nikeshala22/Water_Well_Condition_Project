import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
            mongoose.connection.on('connected', ()=> console.log("Database Connected"));
<<<<<<< HEAD
            const dbName = process.env.NODE_ENV === 'test' ? 'water-well-test' : 'water-well';
            await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
=======
            await mongoose.connect(`${process.env.MONGODB_URI}/water-well`)
>>>>>>> d9eb8a1aa76b90a7c345679610793cb082767644
    } catch (error) {
        console.log(error.message);
    }
}
export default connectDB;