import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { deviceRouter } from './routes/devices/device'
import adminSettingsRouter from './routes/admin-settings'
import userRouter from './routes/user/user'
import heatingRouter from './routes/heating'
import { HEATING_CONTROLLER_SINGLETON } from './domain/heating/heating-controller'
import { heatingControlRouter } from './routes/devices/heating-control-device.router'
dotenv.config()

const app = express()
const port = process.env.PORT
if (port == null) {
  throw new Error('PORT is not set')
}

const secretKey = process.env.SECRET_KEY
if (secretKey == null) {
  throw new Error('SECRET_KEY is not set')
}

const dbUrl = process.env.DATABASE_URL
if (dbUrl == null) {
  throw new Error('DATABASE_URL is not set')
}

const dbName = process.env.DATABASE_NAME
if (dbName == null) {
  throw new Error('DATABASE_NAME is not set')
}

app.use(
  session({
    secret: secretKey, // session encryption key
    resave: false,
    saveUninitialized: true
  })
)

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use('/admin-settings', adminSettingsRouter)
app.use('/device', deviceRouter)
app.use('/user', userRouter)
app.use('/heating', heatingRouter)
app.use('/heating-control', heatingControlRouter)

app.get('/', (_, res) => {
  res.send('Hello World!')
})

async function connectToDb (dbUrl: string): Promise<mongoose.Connection> {
  console.info('🛫 Connecting to database...')
  await mongoose.connect(dbUrl, { dbName })
  return mongoose.connection
}
connectToDb(dbUrl)
  .then(async (connection: mongoose.Connection) => {
    console.info('🛬 Connected to database, using database "' + dbName + '".')
    await HEATING_CONTROLLER_SINGLETON.startSync()
    console.info('🔥 Heating controller sync started')
    app.listen(port, () => {
      console.info(`Server running at http://localhost:${port} 🚀`)
    })
  })
  .catch((e) => {
    console.warn(e)
    console.warn('❌ Failed to connect to database, exiting...')
    process.exit(1)
  })
