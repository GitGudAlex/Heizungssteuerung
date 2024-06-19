import express from 'express'
import { User } from '../../model/user'
import authRouter from './auth'
import loginRouter from './login'

const userRouter = express.Router()

userRouter.use('/auth', authRouter)
userRouter.use('/login', loginRouter)

// endpoint to update sepiaMode setting
userRouter.post('/sepiaMode', async (req, res) => {
  try {
    const { userId, sepiaMode } = req.body

    await User.findByIdAndUpdate(userId, { sepiaMode })

    res.status(200).json({ message: 'Sepia mode setting updated successfully' })
  } catch (error) {
    console.error('Error updating sepia mode setting:', error)
    res.status(500).json({ message: 'Could not update sepia mode setting' })
  }
})

// endpoint to update temperature setting
userRouter.post('/temperature', async (req, res) => {
  try {
    const { userId, temperature } = req.body

    await User.findByIdAndUpdate(userId, { temperature })

    res.status(200).json({ message: 'Temperature setting updated successfully' })
  } catch (error) {
    console.error('Error updating temperature setting:', error)
    res.status(500).json({ message: 'Could not update temperature setting' })
  }
})

// endpoint to update room setting
userRouter.post('/room', async (req, res) => {
  try {
    const { userId, room } = req.body

    await User.findByIdAndUpdate(userId, { room })

    res.status(200).json({ message: 'Room setting updated successfully' })
  } catch (error) {
    console.error('Error updating room setting:', error)
    res.status(500).json({ message: 'Could not update room setting' })
  }
})

// endpoint to update fontSize setting
userRouter.post('/fontSize', async (req, res) => {
  try {
    const { userId, fontSize } = req.body

    await User.findByIdAndUpdate(userId, { fontSize })

    res.status(200).json({ message: 'Font size setting updated successfully' })
  } catch (error) {
    console.error('Error updating font size  setting:', error)
    res.status(500).json({ message: 'Could not update font size  setting' })
  }
})

// get full user object with settings
userRouter.get('/:id', async (req, res) => {
  try {
    // Retrieve the userId from the request params
    const { id } = req.params

    if (!id || id === 'undefined') {
      console.error('userId is required')
      return res.status(400).json({ message: 'userId is required' })
    }

    // Fetch the user from the database
    const user = await User.findOne({ _id: id })

    if (user == null) {
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
