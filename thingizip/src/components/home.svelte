<script lang="ts" async>
  import SkeletonImage from './skeletonImage.svelte';
  import SkeletonCreatorImg from './skeletonCreatorImg.svelte';
  import { fetchDetails } from '../utils/details';
  import { BadgeType } from '../utils/data/badgeType';
  import Badge from './badge.svelte';
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
    const promise = fetchDetails();

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
