<script lang="ts">
  import { Button, ButtonGroup } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { addFontSize } from '~/components/settings/getTextSize.js'
  import { lineHeight } from '~/components/settings/TextSpaceSetting.svelte'
  // Props for the component
  export let translations: { [key: string]: string }
  export let lang: string
  export let backendUrl: string

  let initialSettings = {
    invitationCode: '',
    defaultTemp: 16,
    preheatingMinutesPerDegree: 5,
    isSyncActive: true,
    nightlyShutoff: { off: 22, on: 4 },
  }

  let invitationCode = ''
  let defaultTemp = 16
  let preheatingMinutesPerDegree = 5
  let isSyncActive = true
  let nightlyShutoff = { off: 22, on: 4 }

  // Store for tracking changes in inputs
  const settingsChanged = writable(false)

  // Fetch initial settings from the database
  onMount(async () => {
    try {
      const response = await fetch(`${backendUrl}/admin-settings`)
      if (response.ok) {
        initialSettings = await response.json()
        invitationCode = initialSettings.invitationCode
        defaultTemp = initialSettings.defaultTemp ?? defaultTemp
        preheatingMinutesPerDegree = initialSettings.preheatingMinutesPerDegree ?? preheatingMinutesPerDegree
        isSyncActive = initialSettings.isSyncActive ?? false
        nightlyShutoff = initialSettings.nightlyShutoff ?? nightlyShutoff
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
      const response = await fetch(`${backendUrl}/admin-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode,
          defaultTemp,
          preheatingMinutesPerDegree,
          isSyncActive,
          nightlyShutoff,
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
      <h2 class="text-lg font-bold mb-2 setting-title">{translations['invitationCode']}</h2>
      <p class="setting-description text-space">{translations['invitationCodeDescription']}</p>
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
          class="bg-purple-800 hover:bg-purple-700 dark:hover:bg-purple-900 text-white font-bold py-3 px-8 rounded-full transition duration-300"
          on:click={() =>
            copyToClipboard(`${window.location.origin}/${lang}/register?invitationCode=${invitationCode}`)}
        >
          {translations['copyLink']}
        </button>
      </div>
    </div>

    <!-- Nightly Shutoff Card -->
    <div
      class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300 {isSyncActive
        ? ''
        : 'disabled-card'}"
    >
      <h2 class="text-lg font-bold mb-2 setting-title">{translations['nightlyShutoff']}</h2>
      <p class="text-sm mb-4 setting-description text-space">{translations['nightlyShutoffDescription']}</p>
      <div class="input input-bordered flex flex-col gap-4">
        <label class="flex items-center gap-2 setting-description text-space">
          {translations['nightlyShutoffOffTime']}
          <input
            type="number"
            class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent"
            min="0"
            max="23"
            step="1"
            placeholder={translations['offTime']}
            bind:value={nightlyShutoff.off}
            disabled={!isSyncActive}
            on:input={handleInputChange}
          />
        </label>
        <label class="flex items-center gap-2 setting-description text-space">
          {translations['nightlyShutoffOnTime']}
          <input
            type="number"
            class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent"
            min="0"
            max="23"
            step="1"
            placeholder={translations['onTime']}
            disabled={!isSyncActive}
            bind:value={nightlyShutoff.on}
            on:input={handleInputChange}
          />
        </label>
      </div>
    </div>

    <!-- Default Temperature Card -->
    <div
      class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300 card-container-transition {isSyncActive
        ? ''
        : 'disabled-card'}"
    >
      <label for="defaultTemp">
        <h2 class="text-lg font-bold mb-2 setting-title">{translations['defaultTemp']}</h2>
      </label>
      <p class="setting-description text-space">{translations['defaultTempDescription']}</p>
      <div class="input input-bordered flex items-center gap-2 mb-4">
        <input
          min="8"
          max="28"
          step="1"
          type="number"
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
      <label for="preheatingMinutesPerDegree"
        ><h2 class="text-lg font-bold mb-2 setting-title">{translations['preheatingMinutesPerDegree']}</h2></label
      >
      <p class="setting-description text-space">{translations['preheatingMinutesPerDegreeDescription']}</p>
      <div class="input input-bordered flex items-center gap-2 mb-4">
        <input
          min="0"
          max="180"
          step="1"
          type="number"
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
      <h2 class="text-lg font-bold mb-2 setting-title">{translations['isSyncActive']}</h2>
      <p class="setting-description text-space">{translations['isSyncActiveDescription']}</p>
      <div class="my-8">
        <ButtonGroup>
          <Button
            size="lg"
            outline
            checked={true === isSyncActive}
            color="dark"
            on:click={() => handleButtonClick(true)}
          >
            {translations['enable']}
          </Button>
          <Button
            size="lg"
            outline
            checked={false === isSyncActive}
            color="dark"
            on:click={() => handleButtonClick(false)}
          >
            {translations['disable']}
          </Button>
        </ButtonGroup>
      </div>
    </div>

    <!-- Save Button -->
    <button
      class="rounded-full px-4 py-2 bg-red-800 text-white hover:bg-red-500 transition duration-300 button-font-size"
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
