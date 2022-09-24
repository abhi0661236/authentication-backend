import mongoose from "mongoose";

const connectdb =async (user, password)=>{
    let dbUri = `mongodb+srv://${user}:${password}@mern-auth.bupdcmp.mongodb.net/?retryWrites=true&w=majority`;
    try {
        mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected successfully with Database.")
    } catch (error) {
        console.log("connection faild...");
    }
}

export default connectdb;