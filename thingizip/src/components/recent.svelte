<script lang="ts">
  import { formatTimeDifference } from '../utils/helpers';
  export let name;
  export let thumbnail;
  export let creatorName;
  export let detailsTimestamp: number;
  export let link;
  let timeAgo = formatTimeDifference(detailsTimestamp);
</script>

<a
  href={link}
  target="_blank"
  type="button"
  class="w-full inline-flex items-center rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600">
  <div class="flex flex-col w-full">
    <div class="inline-flex mb-2 h-4 justify-between">
      <span
        class="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
        <svg
          class="mr-1.5 h-2.5 w-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path
            d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
        </svg>
        {timeAgo}
      </span>
    </div>
    <div class="inline-flex">
      {#if thumbnail == undefined}
        <div role="status" class="animate-pulse self-start">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-300 dark:bg-gray-700">
            <svg
              class="h-5 w-5 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18">
              <path
                d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
      {:else}
        <div role="status" class="flex-none self-start">
          <img
            src={thumbnail}
            alt="thumbnail"
            class="object-cover flex h-10 w-10 items-center justify-center rounded-md bg-gray-300 dark:bg-gray-700" />
        </div>
      {/if}
      <div class="ml-2 flex max-w-[80%] flex-col flex-1">
        <div class="inline-flex items-center justify-between">
          <h5 class="truncate">{name}</h5>
        </div>
        <div class="inline-flex">
          <h5 class="text-sm truncate text-stone-300">by {creatorName}</h5>
        </div>
      </div>
    </div>
  </div>
</a>

<!-- Recents don't show current. Add but hide from showing? -->
<!-- Remove 30% width on button, use full width on ext bc margins -->

<!-- recent.svelte get the values from storage and passes to components -->
<!-- components are wrapped in a <a> with the corresponding link -->

<!-- https://nerdcave.com/tailwind-cheat-sheet -->
