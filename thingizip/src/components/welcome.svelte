<script lang="ts">
  import { fetchDetails } from '../utils/details';
  import { BASE_URL } from '../utils/constants';
  import { removeActiveTabPermission, requestActiveTabPermission, getActiveTabPermission } from "../utils/helpers";

  let manualInputVal;
  let isAccessGranted: boolean;

  getPermission();
  
  function getPermission(){
    getActiveTabPermission().then((result) => {
      isAccessGranted = result;
    })
  }

  function toggleActiveTabPermission(){
    getPermission();

    if(isAccessGranted){
      removeActiveTabPermission();
    }
    else{
      requestActiveTabPermission();
    }

    getPermission();
  }

  function search(){
    if(!manualInputVal.startsWith(BASE_URL)){
      return;
    }

    const promise = fetchDetails(manualInputVal);

    promise.then((details) => {
      if(details != undefined){
        location.reload();
        return;
      }
    }).catch((error) => {
      console.log("Error:", error);
    })
  }
</script>

<!-- Flex -->
<div class="grid grid-cols-1 gap-4 cursor-default">
  <!-- Welcome -->
  <div>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Welcome!</h5>
    <p class="text-xs text-white">There are two ways to download files from Thingiverse.</p>
  </div>

  <!-- Automatic -->
  <div class="">
    <h5 class="font mb-2 text-lg tracking-tight text-white">Automatic</h5>
    <p class="mb-2 text-xs font-normal text-gray-400">Whenever the extension is opened on a valid Thingiverse page, it will automatically retrieve the required information needed for the download.</p>
    <p class="mb-2 text-xs font-normal text-gray-400">Automatic mode requires access to detect when you're on a valid Thingiverse page.</p>

    <p class="mb-1 text-xs font-normal text-gray-400">A valid page looks like:</p>
    <code class="rounded-sm bg-gray-200 p-0.5 text-xs text-black">https://www.thingiverse.com/thing:6145551</code>

    {#if isAccessGranted}
    <button type="button" on:click={toggleActiveTabPermission} class="mt-2 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-4 py-1.5 text-center text-sm font-medium text-white shadow-lg shadow-red-800/80 hover:bg-gradient-to-br">Revoke Access</button>
    {:else}
      <button type="button" on:click={toggleActiveTabPermission} class="mt-2 rounded-lg bg-gradient-to-r from-green-500 via-green-600 to-green-700 px-4 py-1.5 text-center text-sm font-medium text-white shadow-lg shadow-green-800/80 hover:bg-gradient-to-br">Grant Access</button>
    {/if}
  </div>

  <!-- Manual -->
  <div>
    <h5 class="font mb-2 text-lg tracking-tight text-white">Manual</h5>
    <p class="mb-2 text-xs font-normal text-gray-400">Paste the link of the Thingiverse page below.</p>

    <form on:submit|preventDefault={search}>
      <div class="flex">
        <div class="relative w-full">
          <input type="search" bind:value={manualInputVal} class="caret-current z-20 block w-full rounded-lg border border-l-2 border-gray-600 bg-gray-700 p-1.5 text-xs text-white placeholder:italic placeholder:text-xs placeholder-gray-400" placeholder="https://www.thingiverse.com/thing:6145551" required />
          <button type="submit" class="absolute right-0 top-0 h-full rounded-r-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-3 py-2 text-center shadow-lg shadow-blue-800/80 hover:bg-gradient-to-br text-sm font-medium text-white">
            <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  </div>

  <!-- Button -->
  <a href="https://www.thingiverse.com/" target="_blank" type="button" class="rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-blue-800/80 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-blue-800"> Visit Thingiverse </a>
</div>