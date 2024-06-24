<script context="module">
  import { writable } from 'svelte/store';
  export const calendarString = writable("");
</script>


<script lang="ts">
  import { onMount } from 'svelte';
  export let translations
  export let userId

  let defaultUserString = "";
  onMount(() => {
    loadCalString();
  });

  const updateDbSettings = async (userId: string, setCalString: string) => {
    try {
      const response = await fetch('http://localhost:3000/user/calString', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, calString:setCalString}),
      });
      if (response.ok) {
        console.log('New calendar string was saved successfully to ', setCalString);
      } else {
        console.error('Failed to save new calendar string');
      }
    } catch (error) {
      console.error('Error saving new calendar string:', error);
    }
  }

    const loadCalString = async () => {
      let calS = await getCalendarString(userId);
      defaultUserString = calS
      calendarString.set(calS);
    }



  export async function getCalendarString(userId: string): Promise<string> {
    const response = await fetch(`http://localhost:3000/user/${userId}`, {
      method: 'GET',
    })
    let userCalString; 
    if (!response.ok) {
      throw new Error('Failed to load settings')
    } else {
      const settings = await response.json()
      userCalString = settings.calString
      defaultUserString = settings.calString
      console.log('User calendar setting from db:', userCalString)
    }
    return userCalString
  }

  const updateCalString = async () => {
    await updateDbSettings(userId, $calendarString);
    loadCalString()
  }
</script>



<div class="settings-container">
  <h1 class="setting-title">{translations['calString']}</h1>
  <p class="setting-description text-space">{translations['calStringDescription']}</p>
  <p class="setting-description text-space">{translations['calStringCurrent']}<b> {defaultUserString}</b></p>
  <input class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60 button-font-size"
  type="text" bind:value={$calendarString} placeholder="z.B. ab12@n5" />
  <button class="rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 button-font-size" on:click={updateCalString}>Speichern</button>
</div>

<style>
  .settings-container {
    max-width: 100%;
    margin: 0;
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
  .button-font-size {
    font-size: calc(16px + var(--add-font-size));
  }
</style>