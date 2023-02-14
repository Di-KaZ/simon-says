<script>
    import ScoreBoard from "./lib/ScoreBoard.svelte";
    import {
        answerListener,
        Colors,
        colorPressedByPlayer,
        vibrate,
        colorPressedByBot,
        status, statusListener, playWithVoice
    } from "./stores/game.ts";
    import ColorButton from "./lib/ColorButton.svelte";
    import {onDestroy} from "svelte";
    import {requestNotifPerm} from "./stores/notifications.ts";

    const unsubAnswer = colorPressedByPlayer.subscribe(answerListener);
    const unsubVibrateBot = colorPressedByBot.subscribe(vibrate);
    const unsubVibratePlayer = colorPressedByPlayer.subscribe(vibrate);
    const unsubRecognition = status.subscribe(statusListener);
// onMount(() => addEventListener('deviceorientation', (event) => { console.log({x: event.alpha, y: event.gamma})}))
    requestNotifPerm();

    onDestroy(() => {
        unsubAnswer();
        unsubVibrateBot();
        unsubVibratePlayer();
        unsubRecognition();
    });
</script>


<div class="grid grid-rows-none grid-cols-[1fr_3fr] h-screen w-screen bg-gray-800 text-white items-center justify-center">
        <div class="w-full flex flex-col items-center justify-center space-y-4">
            <ScoreBoard/>
            <button class="bg-teal-700 text-sm md:text-lg md:text-2xl px-4 py-2 rounded-xl" on:click={playWithVoice}>Play
                with voice
            </button>
            <button class="bg-teal-700 text-sm md:text-lg md:text-2xl px-4 py-2 rounded-xl" on:click={playWithVoice}>Play
                with move
            </button>
        </div>
        <div class="grid grid-cols-2 grid-rows-2 max-h-screen gap-4 p-8 aspect-square">
            {#each Colors.ALL as color }
                <ColorButton color={color}/>
            {/each}
        </div>
</div>