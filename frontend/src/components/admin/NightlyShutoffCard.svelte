<script>
  import { createEventDispatcher } from 'svelte';

  // Dispatch function to communicate events to parent
  const dispatch = createEventDispatcher();

  // Props
  export let translations;
  export let initialSettings = { off: 22, on: 4 };

  // Local reactive variables
  let off = initialSettings.off;
  let on = initialSettings.on;

  // Function to handle changes and notify parent component
  function handleSettingChange(key, value) {
    if (key === 'off') {
      off = value;
    } else if (key === 'on') {
      on = value;
    }
    dispatch('change', { off, on });
  }
</script>

<div class="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
  <h2 class="text-lg font-bold mb-2 setting-title">{translations['nightlyShutoff']}</h2>
  <p class="text-sm mb-4 setting-description text-space">{translations['nightlyShutoffDescription']}</p>
  <div class="input input-bordered flex flex-col gap-4">
    <label class="flex items-center gap-2 setting-description text-space">
    {translations['nightlyShutoffOffTime']}
      <input
        type="number"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent "
        min="0"
        max="23"
        step="1"
        placeholder={translations['offTime']}
        value={off}
        on:input={(event) => handleSettingChange('off', parseInt(event.target.value))}
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
        value={on}
        on:input={(event) => handleSettingChange('on', parseInt(event.target.value))}
      />
    </label>
  </div>
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
