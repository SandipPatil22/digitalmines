import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

const app = express();

dotenv.config();

// connect to mongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8010, () => {
      console.log(`server is running at port :${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed ", err);
  });

// middleware
app.use(cors());

app.use(express.json({ limit: "50mb" })); //  to parse the JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // to parse form the data in req.body
app.use(cookieParser());

// routes
import roleRouter from './routes/role.route.js'
import userRouter from './routes/user.route.js'
import shiftRoute from './routes/shift.route.js'
import SupervisorRouter from './routes/supervisor.routes.js'
import mineRouter from './routes/mine.routes.js'
import pitRouter from './routes/pit.routes.js'
import benchRouter from "./routes/bench.routes.js";
import loadingRouter from './routes/loading.routes.js'
import dumperRouter from "./routes/dumper.routes.js";
import destinationRouter from "./routes/destination.routes.js";
import operatorRouter from "./routes/operator.routes.js";
import plantRoute from "./routes/plant.routes.js";
import stockpileRoutes from "./routes/stockpile.routes.js";
import buyerRoutes from "./routes/buyers.routes.js";
import targetRouter from "./routes/target.routes.js";


app.use('/api/v1/role',roleRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/shift',shiftRoute)
app.use('/api/v1/supervisor',SupervisorRouter)
app.use('/api/v1/mine', mineRouter)
app.use("/api/v1/pit", pitRouter);
app.use("/api/v1/bench", benchRouter);
app.use("/api/v1/loading", loadingRouter);
app.use("/api/v1/dumper", dumperRouter);
app.use("/api/v1/destination", destinationRouter);
app.use("/api/v1/operator", operatorRouter);
app.use("/api/v1/plant", plantRoute);
app.use("/api/v1/stockpile", stockpileRoutes);
app.use("/api/v1/buyers", buyerRoutes);
app.use("/api/v1/target", targetRouter);

