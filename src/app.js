import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json(
    {
        limit: "16kb"          //    -> This is the setting for receiving data on the server in the JSON format !  
    }
))


app.use( express.urlencoded( 
    {
        extended : true,
        limit : "16kb"          //    -> This is for the setting of the URL data which is going to be accepted on the backend server   
    }
 ) )


app.use(express.static("public"))           //   -> This is for the data that we are going to store on the server for some temprory period of time  



app.use(cookieParser())        //  -> For working with the cookies .  



export default app;