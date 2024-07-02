import { writable } from 'svelte/store'

interface Device {
  name: string
  type: string
  identifier: string
  heaterMap: string
  roomMap: string
  enabled?: boolean
  temperature?: {
    celsius: string
    offset: string
  }
  hkr?: {
    tist: string
    tsoll: string
  }
}

export const deviceList = writable<Device[]>([])

// COmbine Data from /device/db/devices and /heating-control
export async function loadCombinedHeaters(BACKEND_URL: string) {
  try {
    let devices: Device[] = []

    const responseDevices = await fetch(`${BACKEND_URL}/device/db/devices`)
    if (!responseDevices.ok) {
      throw new Error('Failed to fetch devices data')
    }
    devices = await responseDevices.json()

    let heatingDevices: any[] = []
    try {
      const responseHeating = await fetch(`${BACKEND_URL}/device/heating-control`)
      if (responseHeating.ok) {
        heatingDevices = await responseHeating.json()
        console.log('Using real Data: ', heatingDevices)
      } else {
        console.error('Failed to fetch heating-control data:', responseHeating.statusText)
      }
    } catch (error) {
      console.error('Error fetching heating-control data:', error)
    }

    // Combine devices and heating devices
    const combinedDevices = devices.map((device) => {
      const heatingDevice = heatingDevices.find((d) => d.identifier === device.identifier)
      return {
        ...device,
        temperature: heatingDevice ? heatingDevice.temperature : undefined,
        hkr: heatingDevice ? heatingDevice.hkr : undefined,
      }
    })

    // Set the combined devices to the store
    deviceList.set(combinedDevices)
    console.log('Combined devices fetched successfully:', combinedDevices)
  } catch (error) {
    console.error('Error loading combined devices:', error)
  }
}
