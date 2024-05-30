<script lang="ts">
  import { onMount } from 'svelte'

  export let translations: { [key: string]: string }
  export let lang: string

  let username: string = ''
  let password: string = ''
  let cookieMaxAge = 604800 // 1 week in seconds
  let errorMessage: string = ''

  const handleLogin = async () => {
    errorMessage = ''
    try {
      const response = await fetch('http://localhost:3000/user/login/login', {
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
        if (response.status === 401) {
          errorMessage = translations['loginFailed']
        } else {
          errorMessage = translations['genericError']
        }
      }
    } catch (error: any) {
      errorMessage = translations['internalError']
    }
  }

  onMount(() => {
    // Example: Load previously saved credentials from local storage
    const savedCredentials = JSON.parse(localStorage.getItem('credentials') || '{}')
    username = savedCredentials.username || ''
    password = savedCredentials.password || ''
  })
</script>

<div class="flex h-screen">
  <form on:submit|preventDefault={handleLogin} class="pb-8 mb-4 w-full max-w-md">
    {#if errorMessage.length > 0}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}
    <div class="mb-4">
      <label class="block text-sm font-bold mb-2" for="username">{translations['username']}</label>
      <input
        class="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder={translations['username']}
        bind:value={username}
      />
    </div>
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2" for="password">{translations['password']}</label>
      <input
        class="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder={translations['password']}
        bind:value={password}
      />
    </div>
    <div class="flex items-center justify-between mb-6">
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
      >
        {translations['login']}
      </button>
    </div>
    <a href={`/${lang}/register`} class="text-blue-500 hover:underline">{translations['createAccount']}</a>
  </form>
</div>
