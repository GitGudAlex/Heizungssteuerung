import { writable } from 'svelte/store';

interface Device {
  name: string;
  type: string;
  identifier: string;
  heaterMap: string;
  roomMap: string;
  enabled?: boolean;
  temperature?: {
    celsius: string;
    offset: string;
  };
  hkr?: {
    tist: string;
    tsoll: string;
  };
}

export const deviceList = writable<Device[]>([]);

// COmbine Data from /device/db/devices and /heating-control
export async function loadCombinedHeaters() {
  try {
    let devices: Device[] = [];

  
    const responseDevices = await fetch('http://localhost:3000/device/db/devices');
    if (!responseDevices.ok) {
      throw new Error('Failed to fetch devices data');
    }
    devices = await responseDevices.json();

    let heatingDevices: any[] = [];
    try {
      const responseHeating = await fetchWithTimeout('http://localhost:3000/device/heating-control', 10000);
      if (responseHeating.ok) {
        heatingDevices = await responseHeating.json();
        console.log("Using real Data: ", heatingDevices);
      } else {
        console.error('Failed to fetch heating-control data:', responseHeating.statusText);
      }
    } catch (error) {
      console.error('Error fetching heating-control data:', error);
    }

    // If no heating devices are available, use dummy data
    if (heatingDevices.length === 0) {
      heatingDevices = [
        {
          identifier: '09995 0688917',
          id: '25',
          functionbitmask: '320',
          fwversion: '05.08',
          manufacturer: 'AVM',
          productname: 'FRITZ!DECT 301',
          present: '1',
          txbusy: '0',
          name: 'FRITZ!DECT 301 #10',
          battery: '40',
          batterylow: '0',
          temperature: {
            celsius: '220',
            offset: '0',
          },
          hkr: {
            tist: '44',
            tsoll: '40',
            absenk: '32',
            komfort: '42',
            lock: '0',
            devicelock: '0',
            errorcode: '0',
            windowopenactiv: '0',
            windowopenactiveendtime: '0',
            boostactive: '0',
            boostactiveendtime: '0',
            batterylow: '0',
            battery: '40',
            nextchange: {
              endperiod: '1718380800',
              tchange: '42',
            },
            summeractive: '0',
            holidayactive: '0',
            adaptiveHeatingActive: '0',
            adaptiveHeatingRunning: '0',
          },
        },
        {
          identifier: '09995 0593849',
          id: '27',
          functionbitmask: '320',
          fwversion: '05.08',
          manufacturer: 'AVM',
          productname: 'FRITZ!DECT 301',
          present: '1',
          txbusy: '0',
          name: 'FRITZ!DECT 301 #12',
          battery: '100',
          batterylow: '0',
          temperature: {
            celsius: '220',
            offset: '0',
          },
          hkr: {
            tist: '44',
            tsoll: '40',
            absenk: '32',
            komfort: '42',
            lock: '0',
            devicelock: '0',
            errorcode: '0',
            windowopenactiv: '0',
            windowopenactiveendtime: '0',
            boostactive: '0',
            boostactiveendtime: '0',
            batterylow: '0',
            battery: '100',
            nextchange: {
              endperiod: '1718380800',
              tchange: '42',
            },
            summeractive: '0',
            holidayactive: '0',
            adaptiveHeatingActive: '0',
            adaptiveHeatingRunning: '0',
          },
        },
      ];
    }

    // Combine devices and heating devices
    const combinedDevices = devices.map(device => {
      const heatingDevice = heatingDevices.find(d => d.identifier === device.identifier);
      return {
        ...device,
        temperature: heatingDevice ? heatingDevice.temperature : undefined,
        hkr: heatingDevice ? heatingDevice.hkr : undefined,
      };
    });

    // Set the combined devices to the store
    deviceList.set(combinedDevices);
    console.log('Combined devices fetched successfully:', combinedDevices);
  } catch (error) {
    console.error('Error loading combined devices:', error);
  }
}

async function fetchWithTimeout (url: string, timeout: number): Promise<any> {
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('timeout'))
    }, timeout)

    fetch(url)
      .then(async (response) => {
        clearTimeout(timer)
        if (response.ok) {
          return response
        } else {
          reject(new Error(`Request failed with status ${response.status}`))
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
