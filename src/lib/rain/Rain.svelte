<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { RainSimulator, type RainConfig } from "./simulator";

    const {
        dropWidth = 2,
        maxSize = 20,
        minSize = 5,
        maxVelocity = 10,
        minVelocity = 5,
        epilepsia = true,
        children,
    }: { children?: Snippet } & RainConfig = $props();

    let canvas: HTMLCanvasElement;
    let simulator: RainSimulator;

    function onresize() {
        if (!canvas) return;
        simulator?.resize(window.innerWidth, window.innerHeight);
    }

    onMount(() => {
        const ctx = canvas.getContext("2d");

        simulator = new RainSimulator(ctx, {
            dropWidth,
            minSize,
            maxSize,
            minVelocity,
            maxVelocity,
            epilepsia,
        });
        simulator.start();
        onresize();

        return () => simulator.stop();
    });
</script>

<svelte:window {onresize} />

<div>
    <canvas bind:this={canvas}></canvas>
    {@render children?.()}
</div>

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        pointer-events: none;
    }
</style>
