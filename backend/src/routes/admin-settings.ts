import * as dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import {
  AdminSettings,
  type AdminSettingsDocument
} from '../model/adminSettings'
dotenv.config()

const adminRouter = express.Router()

interface AdminSettingsType {
  invitationCode: string
  defaultTemp: number
  preheatingMinutesPerDegree: number
  isSyncActive: boolean
  nightlyShutoff: { off: number, on: number }
}

export async function getAdminSettings (): Promise<AdminSettingsType> {
  // check if there is an admin settings document
  const existingSettings = await AdminSettings.findOne({})
  if (existingSettings !== null) {
    return {
      invitationCode: existingSettings.invitationCode,
      defaultTemp: existingSettings.defaultTemp,
      nightlyShutoff: existingSettings.nightlyShutoff,
      preheatingMinutesPerDegree: existingSettings.preheatingMinutesPerDegree,
      isSyncActive: existingSettings.isSyncActive
    }
  } else {
    // create default settings
    const invitationCode = 'smarthome'
    const defaultTemp = 16
    const nightlyShutoff = { off: 22, on: 4 }
    const preheatingMinutesPerDegree = 5
    const isSyncActive = true
    const newSettings: AdminSettingsDocument = new AdminSettings({
      invitationCode,
      defaultTemp,
      nightlyShutoff,
      preheatingMinutesPerDegree,
      isSyncActive
    })
    await newSettings.save()
    return { invitationCode, defaultTemp, nightlyShutoff, preheatingMinutesPerDegree, isSyncActive }
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
    const {
      invitationCode,
      defaultTemp,
      preheatingMinutesPerDegree,
      isSyncActive,
      nightlyShutoff
    }: AdminSettingsType = req.body

    console.debug('Admin settings received:', {
      invitationCode,
      defaultTemp,
      preheatingMinutesPerDegree,
      isSyncActive,
      nightlyShutoff
    })

    if (!invitationCode || !defaultTemp || !nightlyShutoff || !preheatingMinutesPerDegree) {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    if (typeof invitationCode !== 'string' || typeof defaultTemp !== 'number' || typeof nightlyShutoff !== 'object' || typeof preheatingMinutesPerDegree !== 'number' || typeof isSyncActive !== 'boolean') {
      res.status(400).json({ message: 'Invalid request, Input type is incorrect' })
      return
    }

    if (typeof nightlyShutoff.off !== 'number' || typeof nightlyShutoff.on !== 'number') {
      res.status(400).json({ message: 'Invalid request, Input type nightlyShutoff is incorrect' })
      return
    }

    // check if there is already an admin settings document
    const existingSettings = await AdminSettings.findOne({})
    if (existingSettings !== null) {
      existingSettings.invitationCode = invitationCode
      existingSettings.defaultTemp = defaultTemp
      existingSettings.preheatingMinutesPerDegree = preheatingMinutesPerDegree
      existingSettings.isSyncActive = isSyncActive
      existingSettings.nightlyShutoff = nightlyShutoff
      await existingSettings.save()
      res.json({ message: 'Settings saved successfully' })
    } else {
      const newSettings: AdminSettingsDocument = new AdminSettings({
        invitationCode,
        defaultTemp,
        preheatingMinutesPerDegree,
        isSyncActive,
        nightlyShutoff
      })
      await newSettings.save()
      res.json({ message: 'Settings saved successfully' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default adminRouter
