import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { deviceRouter } from './routes/devices/device'
import adminSettingsRouter from './routes/admin-settings'
import { CALENDAR_FRITZ_SYNC_SINGLETON } from './domain/calendar-fritz-sync/calendar-fritz-sync'
import userRouter from './routes/user/user'
dotenv.config()
CALENDAR_FRITZ_SYNC_SINGLETON.scheduleSyncCron()

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

app.get('/', (_, res) => {
  res.send('Hello World!')
})

async function connectToDb (dbUrl: string): Promise<mongoose.Connection> {
  console.info('🛫 Connecting to database...')
  await mongoose.connect(dbUrl)
  return mongoose.connection
}
connectToDb(dbUrl)
  .then((connection: mongoose.Connection) => {
    connection.useDb(dbName)
    console.info('🛬 Connected to database')
    app.listen(port, () => {
      console.info(`Server running at http://localhost:${port} 🚀`)
    })
  })
  .catch((e) => {
    console.warn(e)
    console.warn('❌ Failed to connect to database, exiting...')
    process.exit(1)
  })
