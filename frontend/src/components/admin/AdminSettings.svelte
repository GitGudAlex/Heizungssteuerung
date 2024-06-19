<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  // Props for the component
  export let translations: { [key: string]: string }
  export let lang: string

  let initialSettings = {
    invitationCode: '',
    buildingOfInterest: '',
    defaultTemp: 0
  }

  let invitationCode = ''
  let buildingOfInterest = ''
  let defaultTemp = 0

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
</script>

<div class="admin-settings-container">
  <form on:submit|preventDefault={handleSaveSettings}>
    <h2 class="text-2xl font-semibold mb-4">{translations['invitationCode']}</h2>
    <p class="mb-4">
      {translations['invitationCodeDescription']}
    </p>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="invitationCode"
        placeholder={translations['invitationCode']}
        bind:value={invitationCode}
        on:input={handleInputChange}
      />
      <button
        type="button"
        class="rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 mt-2"
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
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
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
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="defaultTemp"
        placeholder={translations['defaultTemp']}
        bind:value={defaultTemp}
        on:input={handleInputChange}
      />
    </label>
    <button
      class="rounded-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition duration-300 mt-2"
      type="submit"
    >
      {translations['save']}
    </button>
  </form>
</div>
