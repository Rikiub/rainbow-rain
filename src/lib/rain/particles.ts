export class Raindrop {
	x: number;
	y: number;
	vy: number;
	length: number;
	color: string;
	splashed = false;

	constructor(
		canvasWidth: number,
		minSize = 5,
		maxSize = 20,
		minVelocity = 5,
		maxVelocity = 10,
		color = "rgb(255, 255, 255)",
	) {
		this.x = Math.random() * canvasWidth;
		this.y = -10;
		this.vy = minVelocity + Math.random() * maxVelocity;
		this.length = minSize + Math.random() * maxSize;
		this.color = color;
	}

	update(canvasHeight: number, splashes: Splash[], splash_size: number) {
		if (this.splashed) return;

		this.y += this.vy;
		if (this.y >= canvasHeight - 10) {
			this.splashed = true;
			splashes.push(
				new Splash(this.x, canvasHeight - 10, splash_size, this.color),
			);
		}
	}
}

export class Splash {
	particles: Particle[] = [];
	color: string;

	constructor(x: number, y: number, size: number, color: string) {
		this.color = color;
		for (let i = 0; i < 8; i++) {
			this.particles.push({
				x,
				y,
				vx: (Math.random() - 0.5) * 8,
				vy: -(Math.random() * 5 + 2),
				size: size,
			});
		}
	}

	update() {
		let active = false;
		for (const p of this.particles) {
			p.x += p.vx;
			p.y += p.vy;
			p.vy += 0.3;
			p.size -= 0.02;
			if (p.size > 0) active = true;
		}
		return active;
	}
}

type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
};
