<script lang="ts">
  import { Button } from 'flowbite-svelte'
  import { onMount, tick } from 'svelte'
  import { writable } from 'svelte/store'

  export let translations: any
  export let userId: string
  export let backendUrl: string

  let calendarString = writable('')
  let message = writable('')
  let messageClass = writable('')
  let initialCalendarString: string = ''

  onMount(() => {
    fetchCalendarString()
  })

  async function fetchCalendarString() {
    try {
      const response = await fetch(`${backendUrl}/user/${userId}`, {
        method: 'GET',
      })
      if (!response.ok) {
        if (response.statusText) {
          throw new Error(`${response.statusText}`)
        }
        throw new Error('Failed to load settings')
      }
      const { calString = '' } = await response.json()
      initialCalendarString = calString
      calendarString.set(calString)
    } catch (error) {
      console.error('Error loading calendar string:', error)
      message.set('Failed to load settings')
      messageClass.set('text-red-500')
    }
  }

  async function saveCalendarString() {
    const newCalString = $calendarString
    try {
      if (initialCalendarString === newCalString) {
        message.set('No changes detected')
        messageClass.set('text-blue-500')
        return
      }
      const response = await fetch(`${backendUrl}/user/calString`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, calString: newCalString }),
      })
      if (!response.ok) {
        const json = await response.json()
        if (json?.message) {
          throw new Error(`${json?.message}`)
        }
        if (response.statusText) {
          throw new Error(`${response.statusText}`)
        }
        throw new Error('Failed to save new calendar string')
      }
      message.set('Calendar string saved successfully!')
      messageClass.set('text-green-500')
      console.log('New calendar string was saved successfully:', newCalString)
    } catch (error: any) {
      console.error('Error saving new calendar string: ', error)
      message.set('Failed to save new calendar string: ' + error.message)
      messageClass.set('text-red-500')
    }
    // Automatically clear the message after 3 seconds
    await tick()
    setTimeout(() => {
      message.set('')
    }, 3000)
  }
</script>

<div
  class="settings-container bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
>
  <div class="setting">
    <h1 class="setting-title mr">{translations['calString']}</h1>
  </div>
  <p class="setting-description text-space">{translations['calStringDescription']}</p>
  <input class="input-field" type="text" bind:value={$calendarString} placeholder="e.g., ab12@n5" />
  <Button color="dark" on:click={saveCalendarString}>{translations['save']}</Button>
  <p class="feedback-message {$messageClass} text-sm mt-2">{$message}</p>
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
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
  }

  .input-field {
    width: 100%;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }

  .feedback-message {
    transition: all 0.3s ease-in-out;
  }
</style>
