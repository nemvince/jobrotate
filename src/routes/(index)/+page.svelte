<script lang="ts">
  import { enhance } from '$app/forms';

  export let data;
</script>

{#if data.user}
  <h1>Hello, {data.user.username}</h1>
  <form method="post" action="auth?/logout" use:enhance>
    <button class="btn">Log out</button>
  </form>
{:else}
  <a href="/auth">Log in</a>
{/if}
