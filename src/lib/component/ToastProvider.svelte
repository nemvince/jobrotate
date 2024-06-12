<script>
  import '$lib/app.css';

  import Icon from '@iconify/svelte';
  import { toast, removeToast } from '$lib/store/toast';
  import { slide } from 'svelte/transition';
</script>

<div class="toast">
  {#each $toast as { id, message, type }}
    <div role="alert" class="alert alert-{type} justify-between flex" transition:slide>
      {message}
      <button
        on:click={() => {
          removeToast(id);
        }}
      >
        <Icon icon="mdi:close" />
      </button>
    </div>
  {/each}
</div>
