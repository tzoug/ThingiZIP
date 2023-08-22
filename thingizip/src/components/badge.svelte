<script lang="ts">
  import { BadgeType } from '../utils/data/badgeType';
  export let text;
  export let icon;

  let isLike = icon == BadgeType.Like;
  let isView = icon == BadgeType.View;
  let isComment = icon == BadgeType.Comment;
  let isCollect = icon == BadgeType.Collect;

  $: bgColorClass = isLike
    ? 'bg-red-600'
    : isView
    ? 'bg-blue-700'
    : isComment
    ? 'bg-green-700'
    : isCollect
    ? 'bg-yellow-600'
    : 'bg-gray-400';
</script>

<div
  class={`inline-flex items-center ${bgColorClass} py-0.5 px-2.5 mr-2 rounded shadow-2xl shadow-stone-50`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2.5"
    stroke="white"
    class="w-3 h-3 mr-2">
    {#if isLike}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    {:else if isView}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    {:else if isComment}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    {:else if isCollect}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    {/if}
  </svg>
  <span class="text-xs font-medium dark:text-stone-50">
    {text == undefined ? '-' : text}
  </span>
</div>
