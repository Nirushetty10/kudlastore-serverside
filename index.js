import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from 'body-parser'

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/products.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// mongoDB connection
mongoose.set('strictQuery', true);
const connect = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to database");
  } catch(err) {
    console.log(err);
  }
}

mongoose.connection.on("disconnected" , ()=> {
  console.log("Disconnected from database");
})

//middlewares
app.use("/images", express.static("images"));
app.use(express.static('images'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);




app.listen(PORT, ()=> {
    connect();
    console.log(`Server started on the port ${PORT}`);
})