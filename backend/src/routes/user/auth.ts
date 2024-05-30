import express from 'express'
import { User } from '../../model/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authRouter = express.Router()

const jwtWebTokenSecret = process.env.JWT_WEB_TOKEN_SECRET
if (jwtWebTokenSecret == null) {
  throw new Error('JWT_WEB_TOKEN_SECRET is not set')
}

// Middleware to verify JWT token
export const authenticateToken = (req: any, res: any, next: any): any => {
  console.log('authenticating token')
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

// Protected route
authRouter.get('/verifyAuth', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted' })
})

// Get the user ID from the token
authRouter.get('/userId', authenticateToken, (req: any, res) => {
  res.json({ userId: req.user.userId })
})

authRouter.get(
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

export default authRouter
