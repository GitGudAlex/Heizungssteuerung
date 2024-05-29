/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import authRouter from './routes/auth'
import bodyParser from 'body-parser'
import { deviceRouter } from './routes/devices/device.router'
import calenderRouter from './routes/calendar.router'
import { User } from './model/user'
import adminRouter from './routes/admin'
import userRouter from './routes/user.router'
import { CALENDAR_FRITZ_SYNC_SINGLETON } from './domain/calendar-fritz-sync/calendar-fritz-sync'
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

const jwtWebTokenSecret = process.env.JWT_WEB_TOKEN_SECRET
if (jwtWebTokenSecret == null) {
  throw new Error('JWT_WEB_TOKEN_SECRET is not set')
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

// routes
app.use('/', authRouter)
app.use('/calendar', calenderRouter)
app.use('/admin-settings', adminRouter)
app.use('/devices', deviceRouter)
app.use('/user-settings', userRouter)

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any): any => {
  const authHeader = req.headers.authorization
  const token: string | undefined = authHeader?.split(' ')[1]
  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(
    token,
    jwtWebTokenSecret,
    (err: jwt.VerifyErrors | null, user: any) => {
      if (err != null) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    }
  )
}

app.get('/', (_, res) => {
  res.send('Hello World!')
})

// Protected route
app.get('/verifyAuth', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted' })
})

// Get the user ID from the token
app.get('/userId', authenticateToken, (req: any, res) => {
  res.json({ userId: req.user.userId })
})

app.get(
  '/verifyAdmin',
  authenticateToken,
  async (req: any, res): Promise<void> => {
    try {
      if (req.user === undefined) {
        res.status(401).json({ message: 'No user' })
        return
      }
      // Fetch the user from the database
      const user = await User.findOne({ _id: req.user.userId })

      if (user == null) {
        res.status(404).json({ message: 'User not found' })
        return
      }

      // Check if the user is an admin
      const isAdmin = user.isAdmin
      if (!isAdmin) {
        res.status(401).json({ message: 'User is no admin' })
        return
      }
      res.json({ isAdmin })
    } catch (err) {
      console.error('Error checking admin status:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// connect to database, do not start server if connection fails
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
    console.error('❌ Failed to connect to database, exiting...')
    process.exit(1)
  })
