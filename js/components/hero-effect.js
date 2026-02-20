class LiquifyBackground {
    constructor() {
        this.hero = document.querySelector('.hero');
        if (!this.hero) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'hero__canvas';
        this.hero.insertBefore(this.canvas, this.hero.firstChild);

        this.width = this.hero.offsetWidth;
        this.height = this.hero.offsetHeight;

        this.mouse = { x: -1000, y: -1000 };
        this.blobs = [];
        this.blobCount = 6;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse tracking for Liquid Effect (local to hero)
        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.hero.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.hero.addEventListener('mouseleave', () => {
            this.mouse = { x: -1000, y: -1000 };
        });

        // Initialize Blobs
        const colors = ['#008fa5', '#00616f', '#f59e0b', '#64748b']; // Brand colors
        for (let i = 0; i < this.blobCount; i++) {
            this.blobs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 150 + 100,
                color: colors[i % colors.length],
                angle: Math.random() * Math.PI * 2
            });
        }

        this.animate();
    }

    resize() {
        this.width = this.hero.offsetWidth;
        this.height = this.hero.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.blobs.forEach(blob => {
            // Move blob
            blob.x += blob.vx;
            blob.y += blob.vy;
            blob.angle += 0.005;

            // Bounce off edges
            if (blob.x < -blob.radius || blob.x > this.width + blob.radius) blob.vx *= -1;
            if (blob.y < -blob.radius || blob.y > this.height + blob.radius) blob.vy *= -1;

            // Mouse interaction (repel)
            const dx = this.mouse.x - blob.x;
            const dy = this.mouse.y - blob.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 400) {
                const force = (400 - dist) / 400;
                blob.vx -= (dx / dist) * force * 0.5;
                blob.vy -= (dy / dist) * force * 0.5;
            }

            // Draw blob
            const gradient = this.ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LiquifyBackground();
});
