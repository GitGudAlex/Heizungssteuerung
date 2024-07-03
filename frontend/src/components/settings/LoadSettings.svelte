<script lang="ts">
  import { onMount } from 'svelte'

  export let userId
  export let backendUrl: string

  onMount(async () => {
    if (!localStorage.getItem('settingsLoaded')) {
      await initLocalStorageFromDb(userId)
    }
  })

  const initLocalStorageFromDb = async (userId: string) => {
    try {
      const response = await fetch(`${backendUrl}/user/${userId}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to load settings')
      } else {
        const settings = await response.json()
        localStorage.setItem('sepiaMode', settings.sepiaMode ? 'enabled' : 'disabled')
        // TODO: Add remaining settings as needed
        // Keep track of whether settings have been loaded
        localStorage.setItem('settingsLoaded', 'loaded')
      }
    } catch (error) {
      console.error('Error loading setting:', error)
    }
  }
</script>
