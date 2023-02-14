<script lang="ts">
    import {Colors} from "../stores/game";
    import clsx from "clsx";
    import {
        colorPressedByBot,
        colorPressedByPlayer,
        sequence,
        SimonStatus,
        status
    } from "../stores/game.js";

    export let color: Colors;
</script>

<div class={clsx("flex items-center justify-center", color.position)}>
    <button
            class={clsx(
 "h-full aspect-square transition-all active:scale-90",
 $status !== SimonStatus.answering && "pointer-events-none",
 color.classNames,
  color.position,
  color === $colorPressedByBot && color.activeByBot
  )
  } on:click={() => colorPressedByPlayer.set(color)}>
    </button>
</div>
