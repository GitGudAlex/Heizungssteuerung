<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';

  export let translations;
  export let lang;
  export let userId;

  const roomName = writable<string>('');
  let initialRoomName = '';
  let hasChanged = false;

  onMount(() => {
    loadInitialRoomName();
  });

  const loadInitialRoomName = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user-settings?userId=${userId}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to load settings');

      const settings = await response.json();
      initialRoomName = settings.roomName ?? initialRoomName;
      roomName.set(initialRoomName);
      console.log('Initial room name from db:', initialRoomName);
    } catch (error) {
      console.error('Error loading room name:', error);
    }
  };

  const updateDbSettings = async (userId: string, roomName: string) => {
    try {
      const response = await fetch('http://localhost:3000/user-settings/room-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roomName }),
      });

      if (!response.ok) throw new Error('Failed to update room name setting');

      hasChanged = false;
      initialRoomName = roomName;
    } catch (error) {
      console.error('Error updating room name setting:', error);
    }
  };

  const handleInputChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    roomName.set(value);
    hasChanged = value !== initialRoomName;
  };

  const saveRoomName = () => {
    updateDbSettings(userId, $roomName);
  };
</script>

<div class="settings-container">
  <div class="setting">
    <h1 class="setting-title">{translations['roomName']}</h1>
    <p class="setting-description">{translations['roomNameDescription']}</p>
  </div>
  <div class="setting">
    <input
      type="text"
      bind:value={$roomName}
      on:input={handleInputChange}
      class="input-field"
      aria-label={translations['setRoomName']}
    />
    <div class="current-room-name">
      {$roomName}
    </div>
  </div>
  {#if hasChanged}
    <button
      on:click={saveRoomName}
      class="save-button"
      transition:fly={{ y: 20, duration: 300 }}
    >
      {translations['saveRoomName']}
    </button>
  {/if}
</div>

<style>
  .settings-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .setting {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .setting-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .setting-description {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .input-field {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    outline: none;
    transition: border-color 0.3s;
  }

  .input-field:focus {
    border-color: #007bff;
  }

  .current-room-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  .save-button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .save-button:hover {
    background-color: #0056b3;
  }
</style>