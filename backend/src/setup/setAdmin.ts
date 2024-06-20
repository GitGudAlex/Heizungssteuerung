import { User } from '../model/user'
import mongoose from 'mongoose'
const username = process.argv[2]
const mongoURL = 'mongodb://root:example@localhost:27017/'
const mongoDB = 'heizungssteuerung'

async function makeAdmin (): Promise<void> {
  if (!mongoose.connection.readyState) await mongoose.connect(mongoURL, { dbName: mongoDB })

  if (!username) {
    console.log('Please enter your username')
    process.exit(1)
  }

  try {
    const result = await User.findOneAndUpdate(
      { username },
      { isAdmin: true },
      { new: true }
    )

    if (result) {
      console.log(`The user ${username} is now an admin.`)
    } else {
      console.log(`User ${username} was not found.`)
    }
  } catch (error) {
    console.error('Error while updating admin user privileges:', error)
  } finally {
    await mongoose.connection.close()
  }
}

void makeAdmin()
