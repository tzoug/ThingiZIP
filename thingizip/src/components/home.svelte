<script lang="ts" async>
  import SkeletonImage from './skeletonImage.svelte';
  import SkeletonCreatorImg from './skeletonCreatorImg.svelte';
  import { fetchDetails } from '../utils/details';
  import { BadgeType } from '../utils/data/badgeType';
  import Badge from './badge.svelte';
  import Welcome from './welcome.svelte';
  import Download from './download.svelte';
  import { BASE_URL } from '../utils/constants';

  let isFirstLaunch = undefined;
  let manualInputVal = undefined;

  let name = undefined;
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

  getCurrentDetails();

  function getCurrentDetails() {
    let promise;
    
    if(manualInputVal != undefined && manualInputVal.startsWith(BASE_URL)){
      promise = fetchDetails(manualInputVal);
    }
    else{
      promise = fetchDetails(undefined);
    }

    promise
      .then((details) => {
        displayDetails(details)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function displayDetails(details){
    if (details != null && details != undefined) {
      isFirstLaunch = false;

      name = details['name'];
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
      addedDate = new Date(added).toLocaleDateString();
    } else {
      isFirstLaunch = true;
    }
  }
</script>

{#if isFirstLaunch}
  <Welcome />
{:else}
  <div class="flex flex-col items-center justify-center">
    <div class="w-full">
      <form on:submit|preventDefault={getCurrentDetails}>
        <div class="flex">
          <div class="relative w-full">
            <input type="search" bind:value={manualInputVal} class="caret-current z-20 block w-full rounded-lg border border-l-2 border-gray-600 bg-gray-700 p-1.5 text-sm text-white placeholder:italic placeholder-gray-400 placeholder:text-xs" placeholder="https://www.thingiverse.com/thing:6145551" required />
            <button type="submit" class="absolute right-0 top-0 h-full rounded-r-lg border-blue-700 bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-800">
              <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="w-full rounded-xl mt-2 p-4 shadow-2xl shadow-blue-200/25">
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
              <div class="h-2 rounded-full bg-gray-700 w-40" />
            {:else}
              <h4 class="text-sm font-bold truncate text-zinc-50">{name}</h4>
            {/if}
            {#if creatorName == undefined}
              <div class="h-2 mt-2 rounded-full bg-gray-700 w-40" />
            {:else}
              <h5 class="text-xs/3 font-bold truncate text-zinc-400">
                by {creatorName}
                {#if addedDate != undefined} on {addedDate} {/if}
              </h5>
            {/if}
          </div>
        </div>

        <!-- Badges -->
        <div class="inline-flex">
          <Badge text={likeCount} icon={BadgeType.Like} />
          <Badge text={viewCount} icon={BadgeType.View} />
          <Badge text={commentCount} icon={BadgeType.Comment} />
          <Badge text={collectCount} icon={BadgeType.Collect} />
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
