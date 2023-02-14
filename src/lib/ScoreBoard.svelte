<script lang="ts">
    import {simonSay, status, SimonStatus, round, bestRound, sleep} from "../stores/game.js";

    let loading;

    async function start() {
        await sleep(1500);
        simonSay();
    }
</script>

<div class="col-start-2 row-start-2 flex items-center justify-evenly font-bold text-4xl flex-col text-center space-y-4">
    <h4 class="text-lg font-thin">session best : {$bestRound}</h4>
    <h1>Round <br/> {$round}</h1>
    {#await loading}
        <p>Prepare yourself !</p>
    {:then _}
        {#if $status === SimonStatus.initial}
            <button class="bg-teal-700 text-2xl px-4 py-2 rounded-xl" on:click={() => loading = start()}>Start</button>
        {:else if $status === SimonStatus.saying}
            <p>Simon Says</p>
        {:else if $status === SimonStatus.lost}
            <p>You lost !</p>
            <button class="bg-teal-700 text-sm text-2xl px-4 py-2 rounded-xl" on:click={() => loading = start()}>Play again</button>
        {:else if $status === SimonStatus.answering}
            <p>Answer Simon</p>
        {/if}
    {/await}
</div>

