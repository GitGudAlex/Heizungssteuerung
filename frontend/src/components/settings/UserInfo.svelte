<script lang="ts">
  import { onMount } from 'svelte'

  export let translations
  export let userId

  let user = {}

  onMount(() => {
    getUserInfo()
  })

  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Failed to get user data')
      } else {
        user = await response.json()
        console.log('User data:', user)
      }
    } catch (error) {
      console.error('Error retrieving user data:', error)
    }
  }
</script>

{#if user.username}
  <div class="settings-container bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
    <div class="setting">
      <p>{translations['loggedInAs']}: <b>{user.username}</b></p>
    </div>
  </div>
{/if}
