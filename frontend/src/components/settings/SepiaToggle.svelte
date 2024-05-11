<script lang="ts">
  import { onMount } from 'svelte'

  export let translations
  export let lang
  export let userId

  let sepiaMode = false

  onMount(() => {
    sepiaMode = localStorage.getItem('sepiaMode') === 'enabled'
    updateCheckboxState()
  })

  const updateDbSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/user-settings/sepiaMode', {
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

  const updateCheckboxState = () => {
    const checkbox = document.querySelector('.switch input[type="checkbox"]')
    checkbox.checked = sepiaMode
    checkbox.setAttribute('aria-pressed', sepiaMode.toString())
  }

  const updateBodyFilter = () => {
    if (sepiaMode) {
      document.body.style.filter = 'sepia()'
    } else {
      document.body.style.filter = ''
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      toggleSepiaMode()
    }
  }
</script>

<div class="settings-container">
  <div class="setting">
    <h1 class="setting-title mr">{translations['sepiaMode']}</h1>
    <p class="setting-description">{translations['sepiaModeDesc']}</p>
    <label class="switch">
      <input
        type="checkbox"
        on:change={toggleSepiaMode}
        on:keydown={handleKeyDown}
        aria-pressed={sepiaMode.toString()}
      />
      <span class="slider round"></span>
    </label>
  </div>
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
    font-size: 24px;
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0 0; /* top right bottom left */
    font-size: 16px;
    color: #666;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
