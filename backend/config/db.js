const mongoose=require("mongoose")

const connectionDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI,{

        });

        console.log("mongo db connected "+conn.connection.host);
    } catch (error) {
        console.log("error in conn "+error.message);
        process.exit();
        
    }
}

module.exports=connectionDB