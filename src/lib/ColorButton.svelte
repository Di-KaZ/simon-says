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
 "h-full aspect-square transition-all active:scale- bg-gr",
 $status !== SimonStatus.answering && "pointer-events-none",
  color.position,
  color === $colorPressedByBot || color === $colorPressedByPlayer ? color.active : color.inactive
  )
  } on:click={() => colorPressedByPlayer.set(color)}>
    </button>
</div>
