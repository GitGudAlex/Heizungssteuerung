<script lang="ts">
  import { fly } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { addFontSize } from '~/components/settings/getTextSize.js'
  import LoadingIndicator from '../general/LoadingIndicator.svelte'
  import { lineHeight } from '~/components/settings/TextSpaceSetting.svelte'

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
  let isLoading = false

  // load devices from db
  const loadDevicesFromDb = async () => {
    isLoading = true
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
      errorMessage = translations['failedLoadDevices']
    } finally {
      isLoading = false
    }
  }

  // Save device in db
  const saveDeviceInDb = async () => {
    try {
      isLoading = true
      if (!(await verifyDeviceExistance(newIdentifier))) {
        throw new Error('Device already exists')
      }
      const response = await fetch('http://localhost:3000/device/db/devices', {
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
      errorMessage = translations['failedSaveDevice']
      console.error('Error saving settings:', error)
    } finally {
      isLoading = false
    }
  }

  const verifyDeviceExistance = async (identifier: string) => {
    try {
      const response = await fetch(`http://localhost:3000/device/heating-control/${identifier}`, {
        method: 'GET',
      })
      if (!response.ok) {
        errorMessage = translations['failedVerifyDevice']
        return false
      } else {
        console.log('Device exists:', identifier)
        return true
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      errorMessage = translations['failedVerifyDevice']
      return false
    } finally {
      isLoading = false
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

  $: {
    if (typeof window !== 'undefined' && $addFontSize !== undefined) {
      const cssVar = `${$addFontSize}px`
      document.documentElement.style.setProperty('--add-font-size', cssVar)
    }
  }

  $: {
    if (typeof window !== 'undefined' && $lineHeight !== undefined) {
      const cssVar = `${$lineHeight}`
      document.documentElement.style.setProperty('--line-height', cssVar)
    }
  }
</script>

<main class="mb-4">
  <h2 class="setting-title">{translations['deviceManagement']}</h2>
  <p class="setting-description text-space">
    {translations['deviceManagementDescription']}
  </p>

  <!-- Device Form -->
  <div class="mb-4">
    {#if errorMessage.length > 0}
      <p class="text-red-500 setting-description">{errorMessage}</p>
    {/if}
    <div>
      <LoadingIndicator {isLoading} />
    </div>
    <input
      type="text"
      bind:value={newDeviceName}
      placeholder={translations['name']}
      class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 setting-description"
    />
    <input
      type="text"
      bind:value={newIdentifier}
      placeholder={translations['identifier']}
      class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 setting-description"
    />
    <select bind:value={newDeviceType} class="border rounded p-2 mr-2 bg-transparent setting-description">
      {#each deviceTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
    <select bind:value={newMap} class="border rounded p-2 mr-2 bg-transparent setting-description">
      {#each roomsHeaterMap as roomerHeaterOption}
        <option value={roomerHeaterOption}
          >{roomerHeaterOption.heater.toLocaleLowerCase() +
            ' in ' +
            roomerHeaterOption.room.toLocaleLowerCase()}</option
        >
      {/each}
    </select>
    <button
      on:click={addDevice}
      class="rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 button-font-size"
    >
      {translations['addDevice']}
    </button>
  </div>

  <!-- Device Table -->
  {#if devices.length === 0}
    <p class="setting-description">{translations['noDevicesYet']}</p>
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
  .button-font-size {
    font-size: calc(16px + var(--add-font-size));
    /*transition: font-size 0.5s ease;*/
  }
  .setting-title {
    flex: 1;
    margin: 0;
    font-size: calc(24px + var(--add-font-size));
    /*transition: font-size 0.5s ease;*/
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0.5em 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
    /*transition: font-size 0.5s ease;*/
  }

  .text-space {
    line-height: var(--line-height);
    transition: line-height 0.5s ease;
  }
</style>
