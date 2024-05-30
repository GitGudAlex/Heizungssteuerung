<script lang="ts">
  import { fly } from 'svelte/transition'
  import { onMount } from 'svelte'

  export let translations: { [key: string]: string }

  // Define the structure of a device
  interface Device {
    name: string
    type: string
    identifier: string
    heaterMap: string
    roomMap: string
    enabled?: boolean
  }

  interface RoomsHeater {
    heater: string
    room: string
  }

  interface Maps {
    roomsHeatersMap: RoomsHeater[]
    heaterDeviceTypes: string[]
  }

  let deviceTypes: string[] = [] // ['type1', 'type2', 'type3', 'type4', 'type5']
  let roomsHeaterMap: RoomsHeater[] = [] // [{ heater: 'heater1', room: 'room1' }, { heater: 'heater2', room: 'room2' }

  // Reactive variables
  let devices: Device[] = []
  let newDeviceName = ''
  let newDeviceType: string = ''
  let newIdentifier = ''
  let newMap: RoomsHeater = { heater: '', room: '' }
  let errorMessage = ''

  // load devices from db
  const loadDevicesFromDb = async () => {
    const mapsResponse = await fetch('http://localhost:3000/device/device-map', {
      method: 'GET',
    })
    const maps: Maps = await mapsResponse.json()

    deviceTypes = maps.heaterDeviceTypes
    roomsHeaterMap = maps.roomsHeatersMap

    newDeviceType = deviceTypes[0]
    newMap = roomsHeaterMap[0]

    try {
      const response = await fetch('http://localhost:3000/device/db/devices', {
        method: 'GET',
      })
      if (response.ok) {
        devices = await response.json()
        console.log('Devices fetched successfully:', devices)
      } else {
        errorMessage = translations['failedLoadDevices']
        console.error('Failed to load devices:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  }

  // Save device in db
  const saveDeviceInDb = async () => {
    try {
      const response = await fetch('http://localhost:3000/device/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDeviceName,
          identifier: newIdentifier,
          type: newDeviceType,
          heaterMap: newMap.heater,
          roomMap: newMap.room,
        }),
      })
      if (response.ok) {
        devices = [
          ...devices,
          {
            name: newDeviceName,
            type: newDeviceType,
            identifier: newIdentifier,
            heaterMap: newMap.heater,
            roomMap: newMap.room,
          },
        ]
        newDeviceName = ''
        newDeviceType = deviceTypes[0]
        newIdentifier = ''
        newMap = roomsHeaterMap[0]
      } else {
        deleteDevice(newIdentifier)
        errorMessage = translations['failedSaveDevice']
        console.error('Failed to save settings:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  // Delete device from db
  const deleteDeviceFromDb = async (identifier: string) => {
    try {
      const response = await fetch(`http://localhost:3000/device/db/${identifier}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        errorMessage = translations['failedDeleteDevice']
        console.error('Failed to delete device:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  // Add a new device
  function addDevice() {
    errorMessage = ''
    newDeviceName = newDeviceName.trim()
    newIdentifier = newIdentifier.trim()
    if (newDeviceName.length === 0 || newIdentifier.length === 0) {
      errorMessage = translations['fillAllFields']
      return
    }
    if (newDeviceName && newDeviceType && newIdentifier && newMap) {
      // check if device already exists
      if (devices.find((device) => device.identifier === newIdentifier)) {
        errorMessage = translations['deviceIdentifierExists']
        return
      }
      if (devices.find((device) => device.name === newDeviceName)) {
        errorMessage = translations['deviceNameExists']
        return
      }
      if (devices.find((device) => device.heaterMap === newMap.heater && device.roomMap === newMap.room)) {
        errorMessage = translations['deviceMapExists']
        return
      }
      saveDeviceInDb()
    }
  }

  // Delete a device
  function deleteDevice(identifier: string) {
    devices = devices.filter((device) => device.identifier !== identifier)
    deleteDeviceFromDb(identifier)
  }

  onMount(() => {
    loadDevicesFromDb()
  })
</script>

<main class="mb-4">
  <h1 class="text-2xl font-bold mb-4">{translations['deviceManagement']}</h1>

  <!-- Device Form -->
  <div class="mb-4">
    {#if errorMessage.length > 0}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}
    <input
      type="text"
      bind:value={newDeviceName}
      placeholder={translations['name']}
      class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
    />
    <input
      type="text"
      bind:value={newIdentifier}
      placeholder={translations['identifier']}
      class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
    />
    <select bind:value={newDeviceType} class="border rounded p-2 mr-2 bg-transparent">
      {#each deviceTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
    <select bind:value={newMap} class="border rounded p-2 mr-2 bg-transparent">
      {#each roomsHeaterMap as roomerHeaterOption}
        <option value={roomerHeaterOption}
          >{roomerHeaterOption.heater.toLocaleUpperCase() + ' in ' + roomerHeaterOption.room.toLocaleUpperCase()}</option
        >
      {/each}
    </select>
    <button
      on:click={addDevice}
      class="rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 mt-2"
    >
      {translations['addDevice']}
    </button>
  </div>

  <!-- Device Table -->
  {#if devices.length === 0}
    <p>{translations['noDevicesYet']}</p>
  {:else}
    <table class="min-w-full bg-transparent border rounded">
      <thead>
        <tr>
          <th class="border px-4 py-2 left-align">{translations['name']}</th>
          <th class="border px-4 py-2 left-align">{translations['identifier']}</th>
          <th class="border px-4 py-2 left-align">{translations['type']}</th>
          <th class="border px-4 py-2 left-align">{translations['heaterMap']}</th>
          <th class="border px-4 py-2 left-align">{translations['roomMap']}</th>
          <th class="border px-4 py-2 left-align">{translations['action']}</th>
        </tr>
      </thead>
      <tbody>
        {#each devices as device (device.identifier)}
          <tr in:fly={{ y: -20 }} out:fly={{ y: 20 }}>
            <td class="border px-4 py-2">{device.name}</td>
            <td class="border px-4 py-2">{device.identifier}</td>
            <td class="border px-4 py-2">{device.type}</td>
            <td class="border px-4 py-2">{device.heaterMap}</td>
            <td class="border px-4 py-2">{device.roomMap}</td>
            <td class="border px-4 py-2">
              <button on:click={() => deleteDevice(device.identifier)} class="bg-red-500 text-white p-2 rounded">
                {translations['remove']}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style global>
  /* Import Tailwind CSS */
  @import 'tailwindcss/tailwind.css';

  .left-align {
    text-align: left !important;
  }
</style>
