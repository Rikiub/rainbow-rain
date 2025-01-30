import { Raindrop, type Splash } from "./particles";

export type RainConfig = {
	dropWidth?: number;
	maxSize?: number;
	minSize?: number;
	maxVelocity?: number;
	minVelocity?: number;
	epilepsia?: boolean;
};

const COLORS = [
	"rgb(255, 0, 0)", // Red
	"rgb(0, 255, 0)", // Green
	"rgb(0, 0, 255)", // Blue
	"rgb(255, 255, 0)", // Yellow
	"rgb(0, 255, 255)", // Cyan
	"rgb(255, 0, 255)", // Magenta
];

export class RainSimulator {
	private raindrops: Raindrop[] = [];
	private splashes: Splash[] = [];
	private animationFrame: number;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private config: RainConfig,
	) {}

	start() {
		this.animate();
	}

	stop() {
		cancelAnimationFrame(this.animationFrame);
	}

	resize(width: number, height: number) {
		this.ctx.canvas.width = width;
		this.ctx.canvas.height = height;
	}

	private animate() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		// Create new raindrops
		if (Math.random() < 0.5) {
			this.raindrops.push(
				new Raindrop(
					this.ctx.canvas.width,
					this.config.minSize,
					this.config.maxSize,
					this.config.minVelocity,
					this.config.maxVelocity,
					COLORS[Math.floor(Math.random() * COLORS.length)],
				),
			);
		}

		// Update physics
		for (const drop of this.raindrops)
			drop.update(
				this.ctx.canvas.height,
				this.splashes,
				this.config.dropWidth / 2,
			);
		this.raindrops = this.raindrops.filter((drop) => !drop.splashed);

		// Draw raindrops
		this.ctx.lineWidth = this.config.dropWidth;
		for (const drop of this.raindrops) {
			this.ctx.strokeStyle = this.get_color(drop);
			this.drawRaindrop(drop);
		}

		// Update and draw splashes
		this.splashes = this.splashes.filter((splash) => splash.update());
		for (const splash of this.splashes) {
			this.ctx.fillStyle = this.get_color(splash);
			this.drawSplash(splash);
		}

		this.animationFrame = requestAnimationFrame(() => this.animate());
	}

	private get_color(drop: Raindrop | Splash): string {
		if (this.config.epilepsia) {
			return COLORS[Math.floor(Math.random() * COLORS.length)];
		}
		return drop.color;
	}

	private drawRaindrop(drop: Raindrop) {
		this.ctx.beginPath();
		this.ctx.moveTo(drop.x, drop.y);
		this.ctx.lineTo(drop.x, drop.y + drop.length);
		this.ctx.stroke();
	}

	private drawSplash(splash: Splash) {
		for (const p of splash.particles) {
			if (p.size > 0) {
				this.ctx.beginPath();
				this.ctx.arc(p.x, p.y, 2 * p.size, 0, Math.PI * 2);
				this.ctx.fill();
			}
		}
	}
}
