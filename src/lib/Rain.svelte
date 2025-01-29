<script lang="ts">
    import { onMount, type Snippet } from "svelte";

    interface Props {
        lineWidth?: number;
        size?: number;
        min_size?: number;
        velocity?: number;
        min_velocity?: number;
        raindrop_length?: number;
        children?: Snippet;
    }
    const {
        lineWidth = 2,
        size = 20,
        min_size = 5,
        velocity = 10,
        min_velocity = 10,
        children,
    }: Props = $props();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    const raindrops: Raindrop[] = [];
    const splashes: Splash[] = [];

    const rgb_colors: number[][] = [
        [255, 0, 0], // Red
        [0, 255, 0], // Green
        [255, 0, 255], // Blue
        [255, 255, 0], // Yellow
        [0, 255, 255], // Cyan
        [255, 0, 255], // Magenta
    ];

    class Raindrop {
        x: number;
        y: number;
        vy: number;
        length: number;
        splashed: boolean;

        constructor(canvasWidth: number) {
            this.x = Math.random() * canvasWidth;
            this.y = -10;
            this.vy = min_velocity + Math.random() * velocity; // Vertical velocity variation
            this.length = min_size + Math.random() * size; // Raindrop size variation
            this.splashed = false;
        }

        update(canvasHeight: number) {
            if (!this.splashed) {
                this.y += this.vy;

                // Check if hit the ground
                if (this.y >= canvasHeight - 10) {
                    this.splashed = true;
                    splashes.push(new Splash(this.x, canvasHeight - 10));
                }
            }
        }
    }

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
    }

    class Splash {
        particles: Particle[];
        active: boolean;

        constructor(x: number, y: number) {
            this.particles = [];
            this.active = true;

            const size = 8;

            // Create splash particles
            for (let i = 0; i < size; i++) {
                this.particles.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: -(Math.random() * 5 + 2),
                    life: 1,
                });
            }
        }

        update() {
            this.active = false;

            for (const particle of this.particles) {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.3;
                particle.life -= -0.02;

                if (particle.life > 0) {
                    this.active = true;
                }
            }
        }
    }

    let animationFrame: number;
    const fps = 60;
    let lastTime = 0;

    function animate(timestamp: number) {
        if (!canvas) return;

        const deltaTime = timestamp - lastTime;
        if (deltaTime > 1000 / fps) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create new raindrops
            if (Math.random() < 0.5) {
                raindrops.push(new Raindrop(canvas.width));
            }

            const index = Math.floor(Math.random() * rgb_colors.length);

            // Update and draw raindrops
            ctx.strokeStyle = `rgb(${rgb_colors[index].join(",")})`;
            ctx.lineWidth = lineWidth;

            raindrops.forEach((drop, index) => {
                drop.update(canvas.height);

                if (!drop.splashed) {
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x, drop.y + drop.length);
                    ctx.stroke();
                } else {
                    raindrops.splice(index, 1);
                }
            });

            // Update and draw splashes
            ctx.fillStyle = `rgb(${rgb_colors[index].join(",")}, 0.8)`;

            splashes.forEach((splash, index) => {
                splash.update();

                for (const particle of splash.particles) {
                    if (particle.life > 0) {
                        ctx.beginPath();
                        ctx.arc(
                            particle.x,
                            particle.y,
                            2 * particle.life,
                            0,
                            Math.PI * 2,
                        );
                        ctx.fill();
                    }
                }

                if (!splash.active) {
                    splashes.splice(index, 1);
                }
            });

            lastTime = timestamp;
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function onresize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        animationFrame = requestAnimationFrame(animate);
        onresize();

        return () => {
            cancelAnimationFrame(animationFrame);
        };
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
    }
</style>
