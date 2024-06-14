import * as dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import { AdminSettings, type AdminSettingsDocument } from '../model/adminSettings'
dotenv.config()

const adminRouter = express.Router()

export async function getAdminSettings (): Promise<{ invitationCode: string, calendarRegex: string }> {
  // check if there is an admin settings document
  const existingSettings = await AdminSettings.findOne({})
  if (existingSettings !== null) {
    return { invitationCode: existingSettings.invitationCode, calendarRegex: existingSettings.calendarRegex }
  } else {
    // create default settings
    const invitationCode = 'smarthome'
    const calendarRegex = '.*' // TODO change to default regex
    const newSettings: AdminSettingsDocument = new AdminSettings({ invitationCode, calendarRegex })
    await newSettings.save()
    return { invitationCode, calendarRegex }
  }
}

/**
 * Route to get the admin settings
 * returns the invitation code and the calendar regex
 * if there is no admin settings document, it creates one with the default values
 */
adminRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getAdminSettings()
    res.status(200).json(settings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

adminRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitationCode, calendarRegex }: { invitationCode: string, calendarRegex: string } = req.body
    if (invitationCode === null || calendarRegex === null) {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    // check if there is already an admin settings document
    const existingSettings = await AdminSettings.findOne({})
    if (existingSettings !== null) {
      existingSettings.invitationCode = invitationCode
      existingSettings.calendarRegex = calendarRegex
      await existingSettings.save()
      res.json({ message: 'Settings saved successfully' })
    } else {
      const newSettings: AdminSettingsDocument = new AdminSettings({ invitationCode, calendarRegex })
      await newSettings.save()
      res.json({ message: 'Settings saved successfully' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default adminRouter
