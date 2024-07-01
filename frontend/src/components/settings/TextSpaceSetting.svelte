<script context="module">
  import { writable } from 'svelte/store';
  export const lineHeight = writable(1.5);
</script>


<script lang="ts">
  import { onMount } from 'svelte';
  import { ButtonGroup, Button } from 'flowbite-svelte';
  export let translations
  export let userId

  onMount(() => {
    loadLineHeight();
  });

  $: {
    if (typeof window !== 'undefined' && $lineHeight !== undefined) {
      const cssVar = `${$lineHeight}`;
      document.documentElement.style.setProperty('--line-height', cssVar);
    }
  }
  const updateDbSettings = async (userId: string, newLineHeight: number) => {
    try {
      const response = await fetch('http://localhost:3000/user/lineHeight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, lineHeight:newLineHeight}),
      });
      if (response.ok) {
        console.log('Line height saved successfully to ', newLineHeight);
      } else {
        console.error('Failed to save line height');
      }
    } catch (error) {
      console.error('Error saving line height:', error);
    }
  }

    const loadLineHeight = async () => {
      let dbLH = await getLineHeight(userId);
      lineHeight.set(dbLH);
    }



  export async function getLineHeight(userId: string): Promise<number> {
    const response = await fetch(`http://localhost:3000/user/${userId}`, {
      method: 'GET',
    })
    let userLineHeight; 
    if (!response.ok) {
      throw new Error('Failed to load settings')
    } else {
      const settings = await response.json()
      userLineHeight = settings.lineHeight
      console.log('User line height setting from db:', userLineHeight)
    }
    return userLineHeight
  }

  const updateLineHeight = async (event) => {
    const newLineHeight = event.target.textContent;
    await updateDbSettings(userId, newLineHeight);
    loadLineHeight()
  }
</script>



<div class="settings-container bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
  <div class="setting">
    <h1 class="setting-title mr">{translations['lineHeight']}</h1>
  </div>
  <p class="setting-description">{translations['lineHeightDescription']}</p>
  <ButtonGroup>
      <Button outline checked={$lineHeight === 1} color="dark" on:click={updateLineHeight}>1.0</Button>
      <Button outline checked={$lineHeight ===  1.5} color="dark" on:click={updateLineHeight}>1.5</Button>
      <Button outline checked={$lineHeight ===  2} color="dark" on:click={updateLineHeight}>2.0</Button>
      <Button outline checked={$lineHeight ===  2.5} color="dark" on:click={updateLineHeight}>2.5</Button>
      <Button outline checked={$lineHeight ===  3} color="dark" on:click={updateLineHeight}>3.0</Button>
  </ButtonGroup>
  <div class="setting-description">
    <p class="text-space">{translations['lineHeightExample1']}</p>
    <p class="text-space">{translations['lineHeightExample2']}</p>
  </div>
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