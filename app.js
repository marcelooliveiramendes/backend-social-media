import express from "express";
import mongoose from "mongoose";
import router from './routes/user-route';
import blogRouter from './routes/blog-route';
const app = express();
app.use(express.json());

app.use("/api/user",router);
app.use("/api/blog",blogRouter);
mongoose.connect("mongodb+srv://admin:lY4MwgM2HZA53she@cluster0.vguz6xb.mongodb.net/BlogApp?retryWrites=true&w=majority")
.then(()=>app.listen(5000))
.then(()=>console.log('Connected to DB'))
.catch((err)=>console.log(err));
