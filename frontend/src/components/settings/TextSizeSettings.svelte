<script lang="ts">
    import { onMount } from 'svelte';
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import { getFontSize } from '~/components/settings/getTextSize.js';
    import { addFontSize } from '~/components/settings/getTextSize.js';
    export let translations
    export let lang
    export let userId

    onMount(() => {
        loadNewFontSizeValue()
    });

    $: {
    if (typeof window !== 'undefined' && $addFontSize !== undefined) {
      const cssVar = `${$addFontSize}px`;
      document.documentElement.style.setProperty('--add-font-size', cssVar);
    }
  }

    const loadNewFontSizeValue = async () => {
      let fontSize = await getFontSize(userId);
      addFontSize.set(fontSize);
    }

    const updateDbSettings = async (userId: string, fontSize: string) => {
    try {
      const response = await fetch('http://localhost:3000/user/fontSize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, fontSize }),
      })

      if (!response.ok) {
        throw new Error('Failed to update font size setting')
      } else {
        console.log("Updated new font size to:", fontSize)
      }
    } catch (error) {
      console.error('Error updating fontSize setting:', error)
    }
  }

  const savefontSize = async (event) => {
    let fontSize = event.target.textContent.toLowerCase();
    if (fontSize == "klein"){
      fontSize = "small"
    }
    if (fontSize == "groß"){
      fontSize = "large"
    }
    if (fontSize == "größer"){
      fontSize = "xlarge"
    }
    await updateDbSettings(userId, fontSize)
    loadNewFontSizeValue()
  }


  </script>
    <div class="settings-container">
        <div class="setting">
          <h1 class="setting-title mr">{translations['fontSize']}</h1>
        </div>
        <p class="setting-description">{translations['fontSizeDescription']}</p>
        <ButtonGroup>
            <Button outline checked={$addFontSize === -3} color="dark" on:click={savefontSize}>{translations['textSizeSmall']}</Button>
            <Button outline checked={$addFontSize ===  0} color="dark" on:click={savefontSize}>{translations['textSizeMed']}</Button>
            <Button outline checked={$addFontSize ===  3} color="dark" on:click={savefontSize}>{translations['textSizeLarge']}</Button>
            <Button outline checked={$addFontSize ===  6} color="dark" on:click={savefontSize}>{translations['textSizeXlarge']}</Button>
        </ButtonGroup>
    </div>

  <style>

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
    margin: 0 1.5em 0.5em 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
    transition: font-size 0.5s ease; 
  }

  </style>
 