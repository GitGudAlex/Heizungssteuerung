import * as dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import authRouter from './routes/auth'
import { deviceRouter } from './routes/devices/device.router'
import { User } from './model/user'
import adminRouter from './routes/admin'
dotenv.config()

const app = express()
const port = (process.env.PORT != null) ? parseInt(process.env.PORT, 10) : 3000

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

// connect to MongoDB
async function connectToDb (dbUrl: string): Promise<mongoose.Connection> {
  await mongoose.connect(dbUrl)
  return mongoose.connection
}
connectToDb(dbUrl).catch((e) => { console.error(e) })

app.use(session({
  secret: secretKey, // session encryption key
  resave: false,
  saveUninitialized: true
}))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/', authRouter)
app.use('/admin-settings', adminRouter)
app.use('/device', deviceRouter)

app.get('/', (_, res) => {
  res.send('Hello World!')
})

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any): any => {
  const authHeader = req.headers.authorization
  const token: string | undefined = authHeader?.split(' ')[1]
  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(token, jwtWebTokenSecret, (err: jwt.VerifyErrors | null, user: any) => {
    if (err != null) {
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

// Protected route
app.get('/verifyAuth', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted' })
})

app.get('/verifyAdmin', authenticateToken, async (req: Request, res: Response): void => {
  try {
    // Fetch the user from the database
    const user = await User.findOne({ _id: req.user.userId })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the user is an admin
    const isAdmin = user.isAdmin
    if (!isAdmin) {
      return res.status(401).json({ message: 'User is no admin' })
    }
    res.json({ isAdmin })
  } catch (err) {
    console.error('Error checking admin status:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
