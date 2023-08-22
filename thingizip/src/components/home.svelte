<script lang="ts" async>
  import SkeletonImage from './skeletonImage.svelte';
  import SkeletonCreatorImg from './skeletonCreatorImg.svelte';
  import { collectDetails } from '../utils/collectDetails';
  import Welcome from './welcome.svelte';
  import Download from './download.svelte';

  let isFirstLaunch = undefined;

  let name = undefined;
  let fileCount = undefined;
  let creatorName = undefined;
  let creatorCover = undefined;
  let addedDate = undefined;
  let creatorUrl = undefined;
  let publicUrl = undefined;
  let thumbnail = undefined;
  let likeCount = undefined;
  let collectCount = undefined;
  let commentCount = undefined;
  let viewCount = undefined;

  displayValues();

  function displayValues() {
    const promise = collectDetails();

    promise
      .then((details) => {
        if (details != null && details != undefined) {
          isFirstLaunch = false;

          name = details['name'];
          fileCount = details['file_count'];
          likeCount = details['like_count'] == undefined ? '-' : details['like_count'];
          collectCount = details['collect_count'] == undefined ? '-' : details['collect_count'];
          commentCount = details['comment_count'] == undefined ? '-' : details['comment_count'];
          viewCount = details['view_count'] == undefined ? '-' : details['view_count'];
          creatorName = details['creator']['name'];
          creatorUrl = details['creator']['public_url'];
          creatorCover = details['creator']['thumbnail'];
          thumbnail = details['thumbnail'];
          publicUrl = details['public_url'];

          let added = details['added'];
          let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          addedDate = new Date(added).toLocaleDateString();
        } else {
          isFirstLaunch = true;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
</script>

{#if isFirstLaunch}
  <Welcome />
{:else}
  <div class="flex items-center justify-center">
    <div class="w-full rounded-xl p-4 shadow-2xl shadow-blue-200/25">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <!-- Inner Header -->
        <div class="inline-flex items-center">
          {#if creatorCover == undefined}
            <SkeletonCreatorImg />
          {:else}
            <a href={creatorUrl} target="_blank">
              <img
                src={creatorCover}
                alt="creator-cover"
                class="object-cover h-11 w-11 items-center justify-center rounded-full drop-shadow-xl shadow-lg shadow-cyan-500/50" />
            </a>
          {/if}
          <div class="mx-2 flex flex-col w-[75%]">
            {#if name == undefined}
              <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-40" />
            {:else}
              <h4 class="text-sm font-bold truncate text-zinc-50">{name}</h4>
            {/if}
            {#if creatorName == undefined}
              <div class="h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700 w-40" />
            {:else}
              <h5 class="text-xs/3 font-bold truncate text-zinc-400">
                by {creatorName}
                {#if addedDate != undefined} on {addedDate} {/if}
              </h5>
            {/if}
          </div>
        </div>

        <!-- Chips -->
        <div class="inline-flex">
          <!-- Likes -->
          <div
            class="inline-flex items-center bg-red-100 py-0.5 px-2.5 mr-2 rounded dark:bg-red-600 shadow-2xl shadow-stone-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="white"
              class="w-3 h-3 mr-2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span class="text-xs font-medium dark:text-stone-50">
              {likeCount == undefined ? '-' : likeCount}
            </span>
          </div>

          <!-- Views -->
          <div
            class="inline-flex items-center bg-blue-100 py-0.5 px-1.5 mr-2 rounded dark:bg-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="white"
              class="w-3 h-3 mr-2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-xs font-medium dark:text-stone-50">
              {viewCount == undefined ? '-' : viewCount}
            </span>
          </div>

          <!-- Comments -->
          <div
            class="inline-flex items-center bg-green-100 py-0.5 px-1.5 mr-2 rounded dark:bg-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="white"
              class="w-3 h-3 mr-2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            <span class="text-xs font-medium dark:text-stone-50">
              {commentCount == undefined ? '-' : commentCount}
            </span>
          </div>

          <!-- Collections -->
          <div
            class="inline-flex items-center bg-yellow-100 py-0.5 px-1.5 mr-2 rounded dark:bg-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="white"
              class="w-3 h-3 mr-2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>
            <span class="text-xs font-medium dark:text-stone-50">
              {collectCount == undefined ? '-' : collectCount}
            </span>
          </div>
        </div>

        <!-- Thumbnail -->
        <div class="">
          {#if thumbnail == undefined}
            <SkeletonImage />
          {:else}
            <a href={publicUrl} target="_blank">
              <img
                src={thumbnail}
                alt="thumbnail"
                class="mx-auto flex max-h-40 object-contain items-center justify-center rounded-md drop-shadow-xl shadow-lg shadow-cyan-500/50" />
            </a>
          {/if}
        </div>

        <Download />
      </div>
    </div>
  </div>
{/if}
