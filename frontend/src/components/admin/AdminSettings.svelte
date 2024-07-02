<script lang="ts">
  import { Button, ButtonGroup } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { addFontSize } from '~/components/settings/getTextSize.js'
  import { lineHeight } from '~/components/settings/TextSpaceSetting.svelte'
  // Props for the component
  export let translations: { [key: string]: string }
  export let lang: string

  let initialSettings = {
    invitationCode: '',
    buildingOfInterest: '',
    defaultTemp: 16,
    preheatingMinutesPerDegree: 5,
    isSyncActive: true,
  }

  let invitationCode = ''
  let buildingOfInterest = ''
  let defaultTemp = 16
  let preheatingMinutesPerDegree = 5
  let isSyncActive = true

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
        defaultTemp = initialSettings.defaultTemp ?? defaultTemp
        preheatingMinutesPerDegree = initialSettings.preheatingMinutesPerDegree ?? preheatingMinutesPerDegree
        isSyncActive = initialSettings.isSyncActive ?? false
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
          preheatingMinutesPerDegree,
          isSyncActive,
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

  $: {
    if (typeof window !== 'undefined' && $lineHeight !== undefined) {
      const cssVar = `${$lineHeight}`
      document.documentElement.style.setProperty('--line-height', cssVar)
    }
  }

  const handleButtonClick = (makeSyncActive: boolean) => {
    isSyncActive = makeSyncActive
    settingsChanged.set(true)
  }
</script>

<div class="admin-settings-container mx-auto space-y-4">
  <form on:submit|preventDefault={handleSaveSettings}>
    <!-- Invitation Code Card -->
    <div
      class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
    >
      <h2 class="text-lg font-bold mb-2">{translations['invitationCode']}</h2>
      <p class="text-sm mb-4">{translations['invitationCodeDescription']}</p>
      <div class="input input-bordered flex items-center gap-2 mb-4">
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
          class="bg-purple-500 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          on:click={() => copyToClipboard(`http://localhost:4321/${lang}/register?invitationCode=${invitationCode}`)}
        >
          {translations['copyLink']}
        </button>
      </div>
    </div>

    <!-- Building of Interest Card -->
    <div
      class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
    >
      <h2 class="text-lg font-bold mb-2">{translations['buildingOfInterest']}</h2>
      <p class="text-sm mb-4">{translations['buildingOfInterestDescription']}</p>
      <div class="input input-bordered flex items-center gap-2 mb-4">
        <input
          type="text"
          class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 button-font-size"
          id="buildingOfInterest"
          placeholder={translations['buildingOfInterest']}
          bind:value={buildingOfInterest}
          on:input={handleInputChange}
        />
      </div>
    </div>

    <!-- Default Temperature Card -->
    <div
      class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300 card-container-transition {isSyncActive
        ? ''
        : 'disabled-card'}"
    >
      <h2 class="text-lg font-bold mb-2">{translations['defaultTemp']}</h2>
      <p class="text-sm mb-4">{translations['defaultTempDescription']}</p>
      <div class="input input-bordered flex items-center gap-2 mb-4">
        <input
          type="text"
          class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 button-font-size"
          id="defaultTemp"
          placeholder={translations['defaultTemp']}
          bind:value={defaultTemp}
          on:input={handleInputChange}
          disabled={!isSyncActive}
        />
      </div>
    </div>

    <!-- Preheating Minutes Per Degree  -->
    <div
      class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300 card-container-transition {isSyncActive
        ? ''
        : 'disabled-card'}"
    >
      <h2 class="text-lg font-bold mb-2">{translations['preheatingMinutesPerDegree']}</h2>
      <p class="text-sm mb-4">{translations['preheatingMinutesPerDegreeDescription']}</p>
      <div class="input input-bordered flex items-center gap-2 mb-4">
        <input
          type="text"
          class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-80 button-font-size"
          id="preheatingMinutesPerDegree"
          placeholder={translations['preheatingMinutesPerDegree']}
          bind:value={preheatingMinutesPerDegree}
          on:input={handleInputChange}
          disabled={!isSyncActive}
        />
      </div>
    </div>

    <!-- Sync Active Card -->
    <div
      class=" {!isSyncActive
        ? 'bg-red-500'
        : 'bg-white dark:bg-gray-800'} card-container-transition text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
    >
      <h2 class="text-lg font-bold mb-2">{translations['isSyncActive']}</h2>
      <p class="setting-description text-space">{translations['isSyncActiveDescription']}</p>
      <div class="my-8">
        <ButtonGroup>
          <Button outline checked={true === isSyncActive} color="dark" on:click={() => handleButtonClick(true)}>
            {translations['enable']}
          </Button>
          <Button outline checked={false === isSyncActive} color="dark" on:click={() => handleButtonClick(false)}>
            {translations['disable']}
          </Button>
        </ButtonGroup>
      </div>
    </div>

    <!-- Save Button -->
    <button
      class="rounded-full px-4 py-2 bg-red-700 text-white hover:bg-red-500 transition duration-300 button-font-size"
      type="submit"
    >
      {translations['save']}
    </button>
  </form>
</div>

<style>
  .button-font-size {
    font-size: calc(16px + var(--add-font-size));
  }
  .setting-title {
    flex: 1;
    margin: 0;
    font-size: calc(24px + var(--add-font-size));
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0.5em 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
  }

  .text-space {
    line-height: var(--line-height);
    transition: line-height 0.5s ease;
  }

  .disabled-card {
    opacity: 0.35;
    pointer-events: none;
  }

  .card-container-transition {
    transition: background-color 0.3s ease;
  }
</style>
