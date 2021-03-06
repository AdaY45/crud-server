// import { MongoClient } from '../crudnext/node_modules/mongodb/mongodb'

const { authRouter } = require("./routes/authRoutes");
const { profilesRouter } = require("./routes/profilesRoutes");
const { usersRouter } = require("./routes/userRoutes");
const { dashboardRouter } = require("./routes/dashboardRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;
const MONGO_URI =
  "mongodb://AdaY45:FnpGzTBqQ6MTNLu3@cluster0-shard-00-00.qetzy.mongodb.net:27017,cluster0-shard-00-01.qetzy.mongodb.net:27017,cluster0-shard-00-02.qetzy.mongodb.net:27017/users?ssl=true&replicaSet=atlas-47nay2-shard-0&authSource=admin&retryWrites=true&w=majority";
  
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/users", usersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/dashboard", dashboardRouter);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
  });
}

module.exports = app;
