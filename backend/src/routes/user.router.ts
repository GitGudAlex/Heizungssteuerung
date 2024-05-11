import express from 'express'
import { User } from '../model/user'

const userRouter = express.Router()

// endpoint to update sepiaMode setting
userRouter.post('/sepiaMode', async (req, res) => {
  try {
    // Retrieve sepiaMode value from the request body
    const { userId, sepiaMode } = req.body

    // Update the sepiaMode setting for the user
    await User.findByIdAndUpdate(userId, { sepiaMode })

    res.status(200).json({ message: 'Sepia mode setting updated successfully' })
  } catch (error) {
    console.error('Error updating sepia mode setting:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// get full user object with settings
userRouter.get('/', async (req, res) => {
  try {
    // Retrieve the userId from the request query
    const { userId } = req.query

    // Fetch the user from the database
    const user = await User.findOne({ _id: userId })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Return the user settings
    res.json(user)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default userRouter
