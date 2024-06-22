<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { fly } from 'svelte/transition'

  export let translations
  export let lang
  export let userId

  console.log(userId)

  const minTemp = 8
  const maxTemp = 28
  let initialTemperature = 16 // Default initial temperature
  const temperature = writable<number>(initialTemperature)
  let hasChanged = false

  const loadInitialValue = async () => {
    await fetchInitialTemperatureFromDB(userId)
    temperature.set(initialTemperature)
  }

  const fetchInitialTemperatureFromDB = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'GET',
      })

      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to load settings')
      } else {
        const settings = await response.json()
        const loadedTemperature = settings.temperature ?? initialTemperature
        initialTemperature = loadedTemperature
        console.log('Initial temperature from db:', loadedTemperature)
      }
    } catch (error) {
      console.error('Error loading temperature:', error)
    }
  }

  const updateDbSettings = async (userId: string, temperature: Number) => {
    try {
      const response = await fetch('http://localhost:3000/user/temperature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, temperature }),
      })

      if (!response.ok) {
        throw new Error('Failed to update temperature setting')
      } else {
        hasChanged = false
        initialTemperature = $temperature
      }
    } catch (error) {
      console.error('Error updating temperature setting:', error)
    }
  }

  const handleInputChange = (event: Event) => {
    let value = (event.target as HTMLInputElement).value
    value = value.replace(/[^0-9.,]/g, '') // Allow only numbers and dot or comma for floats
    let numericValue = parseFloat(value)

    if (!isNaN(numericValue)) {
      if (numericValue < minTemp) {
        numericValue = minTemp
      } else if (numericValue > maxTemp) {
        numericValue = maxTemp
      }
      temperature.set(numericValue)
      hasChanged = numericValue !== initialTemperature
    } else {
      temperature.set(minTemp)
      hasChanged = minTemp !== initialTemperature
    }
  }

  const handleSliderChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).valueAsNumber
    temperature.set(value)
    hasChanged = value !== initialTemperature
  }

  const saveTemperature = () => {
    updateDbSettings(userId, $temperature)
  }

  onMount(() => {
    loadInitialValue()
  })
</script>

<div class="settings-container">
  <div class="setting">
    <h1 class="setting-title mr">{translations['temperature']}</h1>
  </div>
  <p class="setting-description">
    {translations['temperatureDescription']}
  </p>
  <div class="setting mt-4">
    <input
      type="number"
      min={minTemp}
      max={maxTemp}
      value={$temperature}
      on:input={handleInputChange}
      class="w-24 p-2 mb-4 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center max-temp-size"
      aria-label={translations['setTemperature']}
    />
    <div class="text-xl font-semibold ml-8 mb-4 max-temp-size">
      {minTemp}°C
    </div>
    <input
      type="range"
      min={minTemp}
      max={maxTemp}
      bind:value={$temperature}
      on:input={handleSliderChange}
      class="w-full h-2 ml-8 mr-8 mb-4 bg-transparent rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 max-temp-size"
      aria-label="Temperature slider"
    />
    <div class="text-xl font-semibold mb-4 max-temp-size">
      {maxTemp}°C
    </div>
  </div>
  {#if hasChanged}
    <button
      on:click={saveTemperature}
      class="px-4 py-2 font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300 button-font-size"
      transition:fly={{ y: 20, duration: 300 }}
    >
      {translations['saveTemperature']}
    </button>
  {/if}
</div>

<style>
  .button-font-size {
    font-size: calc(16px + var(--add-font-size));
    transition: font-size 0.5s ease;
  }
  .max-temp-size {
    font-size: calc(22px + var(--add-font-size));
    transition: font-size 0.5s ease;
  }
  .settings-container {
    max-width: 100%;
    margin: 0;
  }

  .setting {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .setting-title {
    flex: 1;
    margin: 0;
    font-size: calc(24px + var(--add-font-size));
    transition: font-size 0.5s ease;
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
    transition: font-size 0.5s ease;
  }
</style>
