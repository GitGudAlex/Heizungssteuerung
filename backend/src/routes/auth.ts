import * as dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, type UserDocument } from '../model/user'
dotenv.config()

const authRouter = express.Router()

const jwtWebTokenSecret: string = process.env.JWT_WEB_TOKEN_SECRET

authRouter.post('/register', async (req: Request, res: Response): void => {
  try {
    const { username, password }: { username: string, password: string } = req.body

    // check if username already exists
    const existing = await User.findOne({ username })
    if (existing) {
      console.log(existing)
      res.status(400).json({ message: 'Username already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user: UserDocument = new User({ username, password: hashedPassword })
    await user.save()

    res.json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

authRouter.post('/login', async (req: Request, res: Response): void => {
  try {
    const { username, password }: { username: string, password: string } = req.body

    const user = await User.findOne({ username })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }

    if (!user.isApproved) {
      res.status(403).json({ message: 'User not approved by admin' })
      return
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtWebTokenSecret, { expiresIn: '1d' })
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

authRouter.post('/logout', (req: Request, res: Response): void => {
  req.session.destroy((err: Error) => {
    if (err != null) {
      console.error(err)
      return res.status(500).json({ message: 'Failed to logout' })
    }
    res.json({ message: 'Logout successful' })
  })
})

export default authRouter
