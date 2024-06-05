import * as dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, type UserDocument } from '../../model/user'
import { getAdminSettings } from '../admin-settings'
import { ROOMS_HEATERS_MAP } from '../../domain/devices/rooms-heaters-map'
dotenv.config()

const loginRouter = express.Router()

const jwtWebTokenSecret = process.env.JWT_WEB_TOKEN_SECRET
if (jwtWebTokenSecret == null) {
  throw new Error('JWT_WEB_TOKEN_SECRET is not set')
}
const port = process.env.PORT
if (port == null) {
  throw new Error('PORT is not set')
}

loginRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, invitationCode, room }: { username: string, password: string, invitationCode: string, room: string } = req.body

    const rooms = ROOMS_HEATERS_MAP.map((room) => room.room)
    if (!rooms.includes(room)) {
      res.status(400).json({ message: 'Room is not valid' })
      return
    }
    if (!room) {
      res.status(400).json({ message: 'Room is required' })
      return
    }

    // check if username already exists
    const existing = await User.findOne({ username })
    if (existing != null) {
      console.log(existing)
      res.status(409).json({ message: 'Username already exists' })
      return
    }

    // check if invitation code is correct
    const adminSettings = await getAdminSettings()
    if (invitationCode !== adminSettings.invitationCode) {
      res.status(400).json({ message: 'Invalid invitation code' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user: UserDocument = new User({ username, password: hashedPassword, room })
    await user.save()

    res.json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

loginRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: { username: string, password: string } = req.body

    const user = await User.findOne({ username })

    if ((user == null) || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid username or password' })
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

loginRouter.post('/logout', (req: Request, res: Response): void => {
  req.session.destroy((err: Error) => {
    if (err != null) {
      console.error(err)
      return res.status(500).json({ message: 'Failed to logout' })
    }
    res.json({ message: 'Logout successful' })
  })
})

export default loginRouter
