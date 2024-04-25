<script lang="ts">
  // props for the component
  export let translations: { [key: string]: string }
  export let lang: string

  const handleLogout = () => {
    // Remove the auth cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // Redirect
    window.location.href = `/${lang}/login`
  }
</script>

<button
  class="rounded-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition duration-300 mt-2"
  on:click={handleLogout}
>
  {translations['logout']}
</button>
