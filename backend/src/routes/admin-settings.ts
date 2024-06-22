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
  buildingOfInterest: string
  preheatingMinutesPerDegree: number
}

export async function getAdminSettings (): Promise<AdminSettingsType> {
  // check if there is an admin settings document
  const existingSettings = await AdminSettings.findOne({})
  if (existingSettings !== null) {
    return {
      invitationCode: existingSettings.invitationCode,
      defaultTemp: existingSettings.defaultTemp,
      buildingOfInterest: existingSettings.buildingOfInterest,
      preheatingMinutesPerDegree: existingSettings.preheatingMinutesPerDegree
    }
  } else {
    // create default settings
    const invitationCode = 'smarthome'
    const defaultTemp = 16
    const buildingOfInterest = 'n5'
    const preheatingMinutesPerDegree = 5
    const newSettings: AdminSettingsDocument = new AdminSettings({
      invitationCode,
      defaultTemp,
      buildingOfInterest,
      preheatingMinutesPerDegree
    })
    await newSettings.save()
    return { invitationCode, defaultTemp, buildingOfInterest, preheatingMinutesPerDegree }
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
      buildingOfInterest,
      preheatingMinutesPerDegree
    }: AdminSettingsType = req.body
    if (!invitationCode || !defaultTemp || !buildingOfInterest || !preheatingMinutesPerDegree) {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    console.debug('Admin settings received:', {
      invitationCode,
      defaultTemp,
      buildingOfInterest,
      preheatingMinutesPerDegree
    })

    if (typeof invitationCode !== 'string' || typeof defaultTemp !== 'number' || typeof buildingOfInterest !== 'string' || typeof preheatingMinutesPerDegree !== 'number') {
      res.status(400).json({ message: 'Invalid request, Input type is incorrect' })
      return
    }

    // check if there is already an admin settings document
    const existingSettings = await AdminSettings.findOne({})
    if (existingSettings !== null) {
      existingSettings.invitationCode = invitationCode
      existingSettings.defaultTemp = defaultTemp
      existingSettings.buildingOfInterest = buildingOfInterest
      existingSettings.preheatingMinutesPerDegree = preheatingMinutesPerDegree
      await existingSettings.save()
      res.json({ message: 'Settings saved successfully' })
    } else {
      const newSettings: AdminSettingsDocument = new AdminSettings({
        invitationCode,
        defaultTemp,
        buildingOfInterest,
        preheatingMinutesPerDegree
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
