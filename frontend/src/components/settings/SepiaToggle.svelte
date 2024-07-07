<script lang="ts">
  import { onMount } from 'svelte'
  import { ButtonGroup, Button } from 'flowbite-svelte'

  export let translations
  export let lang
  export let userId
  export let backendUrl

  let sepiaMode = false

  onMount(() => {
    sepiaMode = localStorage.getItem('sepiaMode') === 'enabled'
    updateCheckboxState()
  })

  const updateDbSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/user/sepiaMode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, sepiaMode }),
      })

      if (!response.ok) {
        throw new Error('Failed to update sepia mode setting')
      }
    } catch (error) {
      console.error('Error updating sepia mode setting:', error)
    }
  }

  const toggleSepiaMode = () => {
    sepiaMode = !sepiaMode
    localStorage.setItem('sepiaMode', sepiaMode ? 'enabled' : 'disabled')
    updateCheckboxState()
    updateBodyFilter()
    updateDbSettings()
  }

  const disableSepiaMode = () => {
    sepiaMode = false
    localStorage.setItem('sepiaMode', sepiaMode ? 'enabled' : 'disabled')
    updateBodyFilter()
    updateDbSettings()
  }

  const enableSepiaMode = () => {
    sepiaMode = true
    localStorage.setItem('sepiaMode', sepiaMode ? 'enabled' : 'disabled')
    updateBodyFilter()
    updateDbSettings()
  }

  const updateBodyFilter = () => {
    if (sepiaMode) {
      document.body.style.filter = 'sepia()'
    } else {
      document.body.style.filter = ''
    }
  }
</script>

<div
  class="settings-container bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
>
  <div class="setting">
    <h1 class="setting-title mr">{translations['sepiaMode']}</h1>
  </div>
  <p class="setting-description text-space">{translations['sepiaModeDescription']}</p>

  <ButtonGroup>
    <Button size="lg" outline checked={sepiaMode === false} color="dark" on:click={disableSepiaMode}
      >{translations['disable']}</Button
    >
    <Button outline checked={sepiaMode} color="dark" on:click={enableSepiaMode}>{translations['enable']}</Button>
  </ButtonGroup>
</div>

<style>
  .settings-container {
    max-width: 100%;
    margin: 0;
    margin-bottom: 20px;
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
