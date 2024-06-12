<script lang="ts">
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';
  import { addToast } from '$lib/store/toast';
  import { goto } from '$app/navigation';
  let isLoading = false;
</script>

<div class="navbar bg-neutral">
  <div class="navbar-start">
    <a class="btn btn-ghost text-xl" href="/">JobRotate</a>
  </div>
  <div class="navbar-end gap-2">
    <button class="btn btn-ghost btn-circle">
      <div class="indicator">
        <Icon icon="mdi:notifications" class="text-lg" />
        <span class="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button>
    <div class="dropdown dropdown-hover dropdown-end">
      <div tabindex="0" role="button" class="avatar placeholder">
        <div class="bg-base-100 text-neutral-content rounded-full w-10">
          <Icon icon="mdi:user" class="text-2xl" />
        </div>
      </div>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow-xl bg-base-300 gap-2 rounded-box w-52"
      >
        <li>
          <a href="/profile" class="btn btn-ghost btn-sm">
            <Icon icon="mdi:account" class="text-lg" />
            <span>Profile</span>
          </a>
        </li>
        <li>
          <form id="logoutForm" method="post" action="auth?/logout" use:enhance={() => {
            isLoading = true;
            return ({ result }) => {
              isLoading = false;
              if (result.type == 'failure') {
                addToast(String(result.data?.message), 'error');
              } else if (result.type == 'error') {
                addToast(result.error, 'error');
              } else if (result.type == 'redirect') {
                addToast('Logged out!', 'success');
                goto(result.location)
              }
            };
          }} class="hidden" />
          <button disabled={isLoading} type="submit" form="logoutForm" class="btn btn-outline btn-error btn-sm">
            {#if isLoading}
            <Icon icon="mdi:loading" class="text-lg animate-spin" />
            {:else}
            <Icon icon="mdi:logout" class="text-lg" />
            <span>Log out</span>
            {/if}
            </button>
        </li>
      </ul>
    </div>
  </div>
</div>
