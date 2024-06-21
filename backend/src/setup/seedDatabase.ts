/**
 * This file is used to seed the database with some initial data.
 * It is executed when the server starts in development mode.
 * It is not executed if there are already users or heating devices in the database.
 */

import { User } from '../model/user'
import bcrypt from 'bcrypt'

export const seedDatabase = async (): Promise<boolean> => {
  const users = await User.find()

  if (users.length) return false

  const admin = new User({
    username: 'admin',
    password: await bcrypt.hash('admin', 10),
    isAdmin: true
  })

  const user = new User({
    username: 'user',
    password: await bcrypt.hash('user', 10),
    isAdmin: false
  })

  await user.save()
  await admin.save()
  return true
}
