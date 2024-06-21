<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { addFontSize } from '~/components/settings/getTextSize.js'

  // Props for the component
  export let translations: { [key: string]: string }
  export let lang: string

  let initialSettings = {
    invitationCode: '',
    buildingOfInterest: '',
    defaultTemp: 16,
  }

  let invitationCode = ''
  let buildingOfInterest = ''
  let defaultTemp = 16

  // Store for tracking changes in inputs
  const settingsChanged = writable(false)

  // Fetch initial settings from the database
  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/admin-settings')
      if (response.ok) {
        initialSettings = await response.json()
        invitationCode = initialSettings.invitationCode
        buildingOfInterest = initialSettings.buildingOfInterest
        defaultTemp = initialSettings.defaultTemp
        console.log('Settings fetched successfully:', initialSettings)
      } else {
        console.error('Failed to fetch settings:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  })

  // Update settings in the database
  const saveSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode,
          buildingOfInterest,
          defaultTemp,
        }),
      })
      if (response.ok) {
        alert(translations['settingsSaved'])
      } else {
        alert(translations['failedToSaveSettings'])
        console.error('Failed to save settings:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  // Function to handle changes in inputs
  const handleInputChange = () => {
    settingsChanged.set(true)
  }

  // Save settings when the form is submitted
  const handleSaveSettings = async (event: Event) => {
    event.preventDefault()
    if ($settingsChanged) {
      await saveSettings()
      settingsChanged.set(false)
    }
  }

  async function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    alert(translations['linkCopied'])
  }

  $: {
    if (typeof window !== 'undefined' && $addFontSize !== undefined) {
      const cssVar = `${$addFontSize}px`
      document.documentElement.style.setProperty('--add-font-size', cssVar)
    }
  }
</script>

<div class="admin-settings-container">
  <form on:submit|preventDefault={handleSaveSettings}>
    <h2 class="setting-title">{translations['invitationCode']}</h2>
    <p class="setting-description">
      {translations['invitationCodeDescription']}
    </p>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 button-font-size"
        id="invitationCode"
        placeholder={translations['invitationCode']}
        bind:value={invitationCode}
        on:input={handleInputChange}
      />
      <button
        type="button"
        class="rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 button-font-size"
        on:click={() => copyToClipboard('http://localhost:4321/' + lang + '/register?invitationCode=' + invitationCode)}
        >{translations['copyLink']}
      </button>
    </label>
    <h2 class="text-2xl font-semibold mb-4">{translations['buildingOfInterest']}</h2>
    <p class="mb-4">
      {translations['buildingOfInterestDescription']}
    </p>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 button-font-size"
        id="buildingOfInterest"
        placeholder={translations['buildingOfInterest']}
        bind:value={buildingOfInterest}
        on:input={handleInputChange}
      />
    </label>
    <h2 class="text-2xl font-semibold mb-4">{translations['defaultTemp']}</h2>
    <p class="mb-4">
      {translations['defaultTempDescription']}
    </p>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 button-font-size"
        id="defaultTemp"
        placeholder={translations['defaultTemp']}
        bind:value={defaultTemp}
        on:input={handleInputChange}
      />
    </label>
    <button
      class="rounded-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition duration-300 button-font-size"
      type="submit"
    >
      {translations['save']}
    </button>
  </form>
</div>

<style>
  .button-font-size {
    font-size: calc(16px + var(--add-font-size));
    transition: font-size 0.5s ease;
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
    margin: 0 1.5em 0.5em 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
    transition: font-size 0.5s ease;
  }
</style>
