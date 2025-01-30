<script lang="ts">
    import Rain from "$lib/rain/Rain.svelte";
    import type { RainConfig } from "$lib/rain/simulator";

    const config: RainConfig = $state({
        dropWidth: 2,
        minVelocity: 10,
        minSize: 20,
        epilepsia: false,
    });
    let menu = $state(false);
</script>

<main>
    <div class="options">
        {#if menu}
            <button class="no-button close" onclick={() => (menu = false)}>
                Close
            </button>

            <label>
                Width ({config.dropWidth})
                <input
                    type="range"
                    min="1"
                    max="20"
                    bind:value={config.dropWidth}
                />
            </label>

            <label>
                Length ({config.minSize})
                <input
                    type="range"
                    min="1"
                    max="100"
                    bind:value={config.minSize}
                />
            </label>

            <label>
                Velocity ({config.minVelocity})
                <input
                    type="range"
                    min="1"
                    max="40"
                    bind:value={config.minVelocity}
                />
            </label>

            <label>
                Epilepsy?
                <input type="checkbox" bind:checked={config.epilepsia} />
            </label>
        {:else}
            <button class="no-button" onclick={() => (menu = true)}>
                OPTIONS
            </button>
        {/if}
    </div>

    {#key JSON.stringify(config)}
        <Rain {...config} />
    {/key}
</main>

<style>
    :global(body) {
        background-color: black;
        color: white;
        margin: 0;
    }

    main {
        display: flex;
        justify-content: flex-end;
    }

    .no-button {
        background: unset;
        border: unset;
        color: inherit;
    }

    .options {
        border: 2px solid white;
        padding: 1rem;
        max-width: 10rem;

        display: flex;
        flex-direction: column;
        gap: 10px;

        .close {
            justify-content: flex-end;
        }

        label {
            display: flex;
            flex-direction: column;
        }
    }
</style>
