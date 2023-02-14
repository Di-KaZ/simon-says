<script>
    import ScoreBoard from "./lib/ScoreBoard.svelte";
    import {answerListener, Colors, colorPressedByPlayer, vibrate, colorPressedByBot} from "./stores/game.ts";
    import ColorButton from "./lib/ColorButton.svelte";
    import {onDestroy} from "svelte";

    const unsubAnswer = colorPressedByPlayer.subscribe(answerListener);
    const unsubVibrateBot = colorPressedByBot.subscribe(vibrate);
    const unsubVibratePlayer = colorPressedByBot.subscribe(vibrate);

    onDestroy(() => {
        unsubAnswer()
        unsubVibrateBot()
        unsubVibratePlayer()
    });
</script>

<main class="flex items-center justify-center bg-gray-800 text-gray-200 w-screen h-screen">
    <div class="grid grid-cols-3 grid-rows-3 max-h-screen w-screen gap-8 p-8 aspect-square">
        <ScoreBoard/>
        {#each Colors.ALL as color }
            <ColorButton color={color}/>
        {/each}
    </div>
</main>
