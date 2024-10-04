import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import aws from "aws-sdk";

const app = express();

dotenv.config(); 

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed !!!!", err);
  });

// AWS S3
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION, // e.g. 'us-east-1'
});

// Middlewares
app.use(cors());

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// routes
import supervisorRouter from "./routes/supervisor.routes.js";
import minesRouter from "./routes/mines.routes.js";
import pitRouter from "./routes/pit.routes.js";
import loadingRouter from "./routes/loading.routes.js";
import dumperRouter from "./routes/dumper.routes.js";
import operatorRouter from "./routes/operator.routes.js";
import destinationRouter from "./routes/destination.routes.js";
import benchRouter from "./routes/bench.routes.js";
import tripRouter from "./routes/trip.routes.js";
import roleRouter from "./routes/role.routes.js";
import weighbridgeRouter from "./routes/weighbridge.routes.js";
import userRouter from "./routes/user.routes.js";
import triptwoRouter from "./routes/tripTwo.routes.js";
import plantRoute from "./routes/plant.routes.js";
import plantPProductRoute from "./routes/plantProcessProduct.routes.js";
import stockpileRoutes from "./routes/stockpile.routes.js";
import buyerRoutes from "./routes/buyers.routes.js";
import tripThreeRoutes from "./routes/tripThree.ruote.js";
import targetRouter from "./routes/target.routes.js";
import shiftRouter from "./routes/shift.routes.js";
import weighbridgeShiftRouter from './routes/weighbridgeShift.routes.js'
import stockpileShiftRouter from './routes/stockpileShift.routes.js'
import adminRouter from './routes/admin.routes.js'

app.use("/api/v1/supervisor", supervisorRouter);
app.use("/api/v1/mines", minesRouter);
app.use("/api/v1/pit", pitRouter);
app.use("/api/v1/loading", loadingRouter);
app.use("/api/v1/dumper", dumperRouter);
app.use("/api/v1/operator", operatorRouter);
app.use("/api/v1/destination", destinationRouter);
app.use("/api/v1/bench", benchRouter);
app.use("/api/v1/trip", tripRouter);
app.use("/api/v1/tripTwo", triptwoRouter);
app.use("/api/v1/tripThree", tripThreeRoutes);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/weighbridge", weighbridgeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/plant", plantRoute);
app.use("/api/v1/stockpile", stockpileRoutes);
app.use("/api/v1/PlantPProduct", plantPProductRoute);
app.use("/api/v1/buyers", buyerRoutes);
app.use("/api/v1/target", targetRouter);
app.use("/api/v1/shift", shiftRouter);
app.use("/api/v1/weighbridgeshift", weighbridgeShiftRouter);
app.use("/api/v1/stockpileshift", stockpileShiftRouter);
app.use("/api/v1/admin", adminRouter);
