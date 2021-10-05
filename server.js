// import { MongoClient } from '../crudnext/node_modules/mongodb/mongodb' 

const {authRouter} = require('./routes/authRoutes')
const {profilesRouter} = require('./routes/profilesRoutes')
const {usersRouter} = require('./routes/userRoutes')
const {dashboardRouter} = require('./routes/dashboardRoutes')
const express = require('express') 
const mongoose = require('mongoose') 
const cors = require('cors')
//const { authRouter } = require('./routes/auth.routes')
  
const app = express()
const  port = process.env.PORT || 5000 
//const MONGO_URI = "mongodb+srv://AdaY45:52aKpJhQacdIMTda@cluster0.qetzy.mongodb.net/users?retryWrites=true&w=majority"
const MONGO_URI = "mongodb://AdaY45:IVZnyMSnOhSGgOUY@cluster0-shard-00-00.qetzy.mongodb.net:27017,cluster0-shard-00-01.qetzy.mongodb.net:27017,cluster0-shard-00-02.qetzy.mongodb.net:27017/users?ssl=true&replicaSet=atlas-47nay2-shard-0&authSource=admin&retryWrites=true&w=majority"

app.use(express.json())
app.use(cors())
app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/dashboard', dashboardRouter);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`) 
}) 