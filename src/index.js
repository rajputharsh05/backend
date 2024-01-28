//  Always wrap the connection in TRY-CATCH block to catch error
//  Databases are always kept in some remote locations so its always better to use async-await
  

import dotenv from "dotenv"
import connectDB from "./db/database.js";

dotenv.config({
    path: './env'
})

connectDB();



























// import express  from "express";
// const app = express();
// ;( 
//     async () => {
//         try{
           
//             await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//             app.on("error" , (error) => {
//                 console.log("ERRR " ,error)
//                 throw error
//             })

//             app.listen(process.env.PORT, () => {
//                 console.log(`App is listening ${process.env.PORT}`)
//             })

//         }catch(error){
//             console.error("ERROR: ", error);
//         }
//     }
// )()
