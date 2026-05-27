//package imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"

import { corsMiddleware } from "./middleware/cors.js";

//routes
import authRoutes from "./routes/v1/auth.routes.js";
import messageRoutes from "./routes/v1/message.routes.js";
import userRoutes from "./routes/v1/user.route.js";

//database import 
import connectToMongoDB from "./db/connectToMongoDB.js";

import { app, server } from "./socket/socket.js";


dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser());
app.use(corsMiddleware);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});

