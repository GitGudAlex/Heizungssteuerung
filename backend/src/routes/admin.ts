import * as dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import { AdminSettings, type AdminSettingsDocument } from '../model/adminSettings'
dotenv.config()

const adminRouter = express.Router()

adminRouter.get('/', async (req: Request, res: Response): void => {
  try {
    // check if there is an admin settings document
    const existingSettings = await AdminSettings.findOne({})
    if (existingSettings !== null) {
      res.json({ invitationCode: existingSettings.invitationCode, calendarRegex: existingSettings.calendarRegex })
    } else {
      // create default settings
      const invitationCode = process.env.INVITATION_CODE
      const calendarRegex = process.env.CALENDAR_REGEX
      const newSettings: AdminSettingsDocument = new AdminSettings({ invitationCode, calendarRegex })
      await newSettings.save()
      res.json({ invitationCode, calendarRegex })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

adminRouter.post('/', async (req: Request, res: Response): void => {
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
