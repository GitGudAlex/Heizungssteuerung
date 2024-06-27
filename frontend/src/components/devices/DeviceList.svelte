<script lang="ts">
  import { onMount } from 'svelte'
  import { deviceList, loadCombinedHeaters } from '~/stores/deviceStore.ts'
  import { addFontSize } from '~/components/settings/getTextSize.js'
  import LoadingIndicator from '../general/LoadingIndicator.svelte'

  export let translations: { [key: string]: string }
  export let lang: string
  export let userId: string

  let updateMessage = ''
  let errorMessage = ''
  let isLoading = false

  const handleConfirm = async (identifier: string, temperature: number) => {
    try {
      updateMessage = ''
      errorMessage = ''
      isLoading = true
      console.log('Updating temperature setting:', identifier, temperature)
      const response = await fetch('http://localhost:3000/heating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: identifier, temperature }),
      })

      if (!response.ok) {
        errorMessage = translations['failedUpdateTemperature']
        console.error('Failed to update temperature setting:', response.statusText)
      } else {
        updateMessage = translations['temperatureUpdated']
        console.log('Temperature setting updated successfully:', response)
      }
    } catch (error) {
      console.error('Error updating temperature setting:', error)
    } finally {
      isLoading = false
    }
  }

  function handleInput(event: any) {
    const value = event.target.value
    if (value < 8 || value > 28) {
      event.target.value = Math.min(Math.max(parseInt(value), 8), 28)
    }
  }

  onMount(() => {
    loadCombinedHeaters()
  })

  $: {
    if (typeof window !== 'undefined' && $addFontSize !== undefined) {
      const cssVar = `${$addFontSize}px`
      document.documentElement.style.setProperty('--add-font-size', cssVar)
    }
  }
</script>

<div class="mt-8">
  {#if errorMessage.length > 0}
    <p class="text-red-500 mb-4">{errorMessage}</p>
  {/if}
  {#if updateMessage.length > 0}
    <p class="text-teal-500 mb-4">{updateMessage}</p>
  {/if}
  <LoadingIndicator {isLoading} />
</div>
<div class="grid grid-cols-4 gap-4">
  {#each $deviceList as device (device.identifier)}
    <div id={`device-${device.heaterMap}`}>
      <ul class="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16 dark:bg-gray-700">
        <li>
          <div class="px-4 py-2">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">{device.name}</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
                {translations['roomMap']}
                {device.roomMap}
              </p>
              <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">{device.heaterMap}</p>
            </div>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
              {translations['targetValue']}: {device.hkr && device.hkr.tsoll
                ? parseInt(device.hkr.tsoll) / 2
                : 'N/A'}°C, {translations['actualValue']}: {device.temperature
                ? parseInt(device.temperature.celsius) / 10
                : 'N/A'}
              {device.temperature ? '°C' : ''}
            </p>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Status:
                <span class={device.enabled ? 'text-teal-600' : 'text-red-600'}>
                  {device.enabled ? translations['active'] : translations['inactive']}
                </span>
              </p>
              <input
                id={`temperature-${device.heaterMap}`}
                type="number"
                aria-describedby="helper-text-explanation"
                class="w-20 mr-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={`${parseInt(device.temperature.celsius) / 10}°C`}
                on:blur={handleInput}
                bind:this={device.inputRef}
              />
              <button
                class="rounded-lg text-sm font-medium text-white bg-teal-600"
                on:click={() => {
                  handleConfirm(device.identifier, parseFloat(device.inputRef.value))
                }}>{translations['confirm']}</button
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  {/each}
</div>
