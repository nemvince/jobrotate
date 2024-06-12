<script>
  import ToastProvider from '$lib/component/ToastProvider.svelte';
  import Navbar from '$lib/component/nav/Navbar.svelte';
  import '$lib/app.css';
</script>

<ToastProvider />
<main>
  <Navbar />
  <slot />
</main>
