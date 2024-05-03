<script lang="ts">
  import { onMount } from 'svelte'
  import Button from '../general/Button.svelte'

  // props for the component
  export let translations: { [key: string]: string }
  export let lang: string

  let username: string = ''
  let password: string = ''
  let cookieMaxAge = 604800

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const { token } = await response.json()
        document.cookie = `token=${token}; path=/; max-age=${cookieMaxAge}; SameSite=None; Secure`
        window.location.href = `/${lang}/dashboard`
      } else {
        const errorMessage = await response.json()
        console.error('Login failed:', errorMessage.message)
        alert('Login failed: ' + errorMessage.message)
      }
    } catch (error: Error) {
      console.error('Login failed:', error.message)
    }
  }

  onMount(() => {
    // Example: Load previously saved credentials from local storage
    const savedCredentials = JSON.parse(localStorage.getItem('credentials') || '{}')
    username = savedCredentials.username || ''
    password = savedCredentials.password || ''
  })
</script>

<div class="login-container">
  <form on:submit|preventDefault={handleLogin}>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
        <path
          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
        />
      </svg>
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="username"
        placeholder={translations['username']}
        bind:value={username}
      />
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
        <path
          fill-rule="evenodd"
          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        type="password"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="password"
        placeholder={translations['password']}
        bind:value={password}
      />
    </label>

    <Button text={translations['login']} type="submit" />
  </form>

  <a href={`/${lang}/register`} class="text-blue-500 hover:underline">{translations['createAccount']}</a>
</div>
