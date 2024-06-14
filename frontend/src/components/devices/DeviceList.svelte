<script lang="ts">
  import { onMount } from 'svelte'
  import { deviceList } from '~/stores/deviceStore.ts';

  let errorMessage = '';

  export let translations: { [key: string]: string }
  export let lang: string

  const loadDevicesFromDb = async () => {
    try {
      const response = await fetch('http://localhost:3000/device/db/devices', {
        method: 'GET',
      });
      if (response.ok) {
        const devices = await response.json();
        deviceList.set(devices);
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

  function handleInput(event) {
        const value = event.target.value;
        if (value < 8 || value > 26) {
          event.target.value = Math.min(Math.max(parseInt(value), 8), 26);
        }
    }
    
  onMount(() => {
    loadDevicesFromDb();
  })

</script>

<div class="grid grid-cols-4 gap-4">
  {#each $deviceList as device (device.identifier)}
    <div id={`device-${device.heaterMap}`}>
      <ul class="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16 dark:bg-gray-700">
        <li>
          <div class="px-4 py-5">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">{device.name}</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">{translations['roomMap']} {device.roomMap}</p>
              <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">{device.heaterMap}</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-200">Status: 
                <span class="{device.enabled ? 'text-teal-600' : 'text-red-600'}">
                  {device.enabled ? translations['active'] : translations['inactive']}
                </span>
              </p>            
              <input id={`temperature-${device.heaterMap}`} type="number" aria-describedby="helper-text-explanation" class="w-20 mr-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="23°C" on:blur={handleInput}/>
              <button class="rounded-lg text-sm font-medium text-white bg-teal-600" on:click={handleConfirm}>{translations['confirm']}</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  {/each}
</div>
