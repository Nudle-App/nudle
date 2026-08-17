// Constellation background for the hero — drifting particles that connect to
// each other and to the cursor, gently attracted toward the mouse.
(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_DISTANCE = 200;
  const MAX_SPEED = 1.4;

  // Brand purple, drawn at varying alpha
  const HUE = "247 76% 45%";

  let width = 0;
  let height = 0;
  let particles = [];

  const mouse = { x: null, y: null };

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Pull toward the cursor
      if (mouse.x != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0 && distance < MOUSE_DISTANCE) {
          const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
          this.vx += (dx / distance) * force * 0.6;
          this.vy += (dy / distance) * force * 0.6;
        }
      }

      // Friction + speed cap so the swarm settles instead of accelerating
      this.vx *= 0.99;
      this.vy *= 0.99;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > MAX_SPEED) {
        this.vx = (this.vx / speed) * MAX_SPEED;
        this.vy = (this.vy / speed) * MAX_SPEED;
      }
    }

    draw() {
      ctx.fillStyle = `hsl(${HUE} / 0.4)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    const parent = canvas.parentElement;
    width = parent.offsetWidth;
    height = parent.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const distance = Math.hypot(p.x - q.x, p.y - q.y);

        if (distance < CONNECTION_DISTANCE) {
          const alpha = (1 - distance / CONNECTION_DISTANCE) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `hsl(${HUE} / ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      if (mouse.x != null) {
        const distance = Math.hypot(p.x - mouse.x, p.y - mouse.y);

        if (distance < MOUSE_DISTANCE) {
          const alpha = (1 - distance / MOUSE_DISTANCE) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = `hsl(${HUE} / ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", init);

  // Wait a beat so the hero has laid out before sizing the canvas
  setTimeout(() => {
    init();
    animate();
  }, 100);
})();
