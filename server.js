// import { MongoClient } from '../crudnext/node_modules/mongodb/mongodb' 

const {authRouter} = require('./routes/authRoutes')
const {profilesRouter} = require('./routes/profilesRoutes')
const express = require('express') 
const mongoose = require('mongoose') 
const cors = require('cors')
//const { authRouter } = require('./routes/auth.routes')
  
const app = express()
const  port = process.env.PORT || 5000 
const MONGO_URI = "mongodb+srv://AdaY45:1234567890@cluster0.qetzy.mongodb.net/users?retryWrites=true&w=majority"

app.use(express.json())
app.use(cors())
app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`) 
}) 