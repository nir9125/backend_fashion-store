const express=require('express')
const app =express();
const mongoose= require('mongoose');
const dotenv =require('dotenv');
const userRoute = require('./routes/user');
const authRoute=require('./routes/auth');
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

const cors = require("cors");
app.use(cors());
dotenv.config();

mongoose.connect( process.env.MONGO_URL
).then(()=>console.log("DbConnection Successful")).catch((err)=>console.log(err));

app.get("/api/test",()=>{
    console.log("Test is Successfull");
})

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users",userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);


app.listen(process.env.PORT || 5000,()=>console.log("Backend Server is Running"));