<script lang="ts">
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';
  import { addToast } from '$lib/store/toast';
  import { goto } from '$app/navigation';

  let isLogin = true;
  let isLoading = false;

  const setLogin = () => (isLogin = true);
  const setRegister = () => (isLogin = false);
</script>

<div class="container flex justify-center items-center h-svh">
  <div class="card bg-neutral">
    <div role="tablist" class="tabs tabs-bordered mt-1">
      <button on:click={setLogin} role="tab" class="tab" class:tab-active={isLogin}>Log in</button>
      <button on:click={setRegister} role="tab" class="tab" class:tab-active={!isLogin}
        >Register</button
      >
    </div>
    <form
      class="card-body"
      method="post"
      use:enhance={() => {
        isLoading = true;
        return ({ result }) => {
          isLoading = false;
          if (result.type == 'failure') {
            addToast(String(result.data?.message), 'error');
          } else if (result.type == 'error') {
            addToast(result.error, 'error');
          } else if (result.type == 'redirect') {
            addToast('Logged in!', 'success');
            setTimeout(() => goto(result.location), 200);
          }
        };
      }}
    >
      {#if !isLogin}
        <label class="input input-bordered flex items-center gap-2">
          <input type="email" name="email" class="grow" placeholder="Email" />
          <Icon icon="mdi:email" class="text-lg" />
        </label>
      {/if}
      <label class="input input-bordered flex items-center gap-2">
        <input type="username" name="username" class="grow" placeholder="Username" />
        <Icon icon="mdi:user" class="text-lg" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        <input type="password" name="password" class="grow" placeholder="Password" />
        <Icon icon="mdi:key" class="text-lg" />
      </label>
      <div class="card-actions">
        <button
          class="btn btn-outline w-full"
          disabled={isLoading}
          formaction={isLogin ? '?/login' : '?/register'}
        >
          {#if isLoading}
            <Icon icon="mdi:loading" class="text-lg animate-spin" />
          {:else}
            {isLogin ? 'Log in' : 'Register'}
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
