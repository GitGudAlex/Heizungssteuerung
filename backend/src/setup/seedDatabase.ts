/**
 * This file is used to seed the database with some initial data.
 * It is executed when the server starts in development mode.
 * It is not executed if there are already users or heating devices in the database.
 */

import { Device } from '../model/device'
import { User } from '../model/user'
import bcrypt from 'bcrypt'

export const seedDatabase = async (): Promise<boolean> => {
  const users = await User.find()
  const heatingDevices = await Device.find()

  if (users.length || heatingDevices.length) return false

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

  const heatingDevice1 = new Device({
    name: 'Heating Device 1',
    type: 'FRITZ!DECT 301',
    identifier: 12345678,
    heaterMap: 'h10',
    roomMap: 'n001',
    enabled: true
  })

  await user.save()
  await admin.save()
  await heatingDevice1.save()
  return true
}
