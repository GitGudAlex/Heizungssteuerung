<script lang="ts">
  import { onMount } from 'svelte'

  // Define the structure of a device
  interface Device {
    name: string;
    type: string;
    identifier: string;
    map: string;
    status: string;
  }

  let deviceList: Device[] = [];
  let errorMessage = '';

  const loadDevicesFromDb = async () => {
    try {
      const response = await fetch('http://localhost:3000/devices/db/devices', {
        method: 'GET',
      });
      if (response.ok) {
        deviceList = await response.json();
        console.log('Devices fetched successfully:', deviceList);
      } else {
        errorMessage = 'Failed to load devices';
        console.error('Failed to load devices:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  function handleConfirm() {
    // Temperatur ändern
  }
  
  onMount(() => {
    //getDevices()
    loadDevicesFromDb();
  })
</script>

<h1>Device List</h1>
<div class="grid grid-cols-4 gap-4">
  {#each deviceList as device (device.identifier)}
    <div>
      <ul class="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16">
        <li>
          <div class="px-4 py-5">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{device.name}</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">Raum {device.map}</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Status: <span class="text-teal-600">{device.status}</span></p>
              <input type="number" aria-describedby="helper-text-explanation" class="w-20 mr-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="23°C" />
              <button class="rounded-lg text-sm font-medium text-white bg-teal-600" on:click={handleConfirm}>Bestätigen</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  {/each}
</div>
