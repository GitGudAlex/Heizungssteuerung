<script lang="ts">
  import { onMount } from 'svelte'

  /*
  let deviceList: { name: string }[] = []

  const getDevices = async () => {
    try {
      const response = await fetch('http://localhost:3000/device', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to retrieve devices: ' + response.statusText)
      }

      const data = await response.json()

      if (!data.devicelist || !Array.isArray(data.devicelist.device)) {
        throw new Error('Invalid response format: devicelist or device property not found or not an array')
      }

      deviceList = data.devicelist.device
      console.log('Devices:', deviceList)
    } catch (error) {
      console.error('Error retrieving devices:', error)
    }
  }
  */

  onMount(() => {
    //getDevices()
  })
</script>

<h1>Device List</h1>
<div class="grid grid-cols-4 gap-4">
  <div>
    <ul class="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16">
      <li>
          <div class="px-4 py-5">
              <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h01</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">Status: <span class="text-teal-600">Aktiv</span></p>
                <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="w-20 mr-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="23°C" />
                <button class="rounded-lg text-sm font-medium text-white bg-teal-600" on:click={handleConfirm}>Bestätigen</button>
              </div>
          </div>
      </li>
      <li class="border-t border-gray-200">
          <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h02</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-500">Status: <span class="text-red-600">Inaktiv</span></p>
              </div>
          </div>
      </li>
      <li class="border-t border-gray-200">
          <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h06</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-500">Status: <span class="text-yellow-600">Nicht zugewiesen</span></p>
              </div>
          </div>
      </li>
      <li class="border-t border-gray-200">
        <div class="px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h07</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">Status: <span class="text-yellow-600">Nicht zugewiesen</span></p>
            </div>
        </div>
      </li>
      <li class="border-t border-gray-200">
        <div class="px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h08</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">Status: <span class="text-yellow-600">Nicht zugewiesen</span></p>
            </div>
        </div>
      </li>
      <li class="border-t border-gray-200">
        <div class="px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h09</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">Status: <span class="text-yellow-600">Nicht zugewiesen</span></p>
            </div>
        </div>
      </li>
      <li class="border-t border-gray-200">
        <div class="px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h10</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n001</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">Status: <span class="text-yellow-600">Nicht zugewiesen</span></p>
            </div>
        </div>
      </li>
    </ul>
  </div>

  <div>
    <ul class="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16">
      <li>
          <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h03</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n005</p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">Status: <span class="text-teal-600">Aktiv</span></p>
                <input type="number" id="number-input" aria-describedby="helper-text-explanation" class="w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="23°C" />
                <button class="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-teal-600" on:click={handleConfirm}>Bestätigen</button>
              </div>
          </div>
      </li>
      <li class="border-t border-gray-200">
          <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h04</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n005</p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-500">Status: <span class="text-red-600">Inaktiv</span></p>
              </div>
          </div>
      </li>
    </ul>
  </div>

  <div>
    <ul class="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16">
      <li class="border-t border-gray-200">
          <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Heizkörper h05</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum n006</p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-500">Status: <span class="text-red-600">Inaktiv</span></p>
              </div>
          </div>
      </li>
    </ul>
  </div>
  <!--
  <h1>Device List</h1>
  {#if deviceList != null}
    <ul>
      {#each deviceList as device}
        <li>{device.name}</li>
      {/each}
    </ul>
  {:else}
    <p>No devices</p>
  {/if}
  -->
</div>
