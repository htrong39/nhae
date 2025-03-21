document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.getElementById('carousel-container');
  if (!document.getElementById('milk-splash')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'milk-splash';
    carouselContainer.appendChild(canvas);
  }

  const canvas = document.getElementById('milk-splash');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 5; // To hơn
      this.speedX = Math.random() * 5 - 2.5; // Nhanh hơn
      this.speedY = Math.random() * 5 - 2.5;
      this.life = 150; // Sống lâu hơn
      this.rotate = 0;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotate += 5; // Xoay 3D
      this.life--;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotate * Math.PI / 180);
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createSplash(x, y) {
    for (let i = 0; i < 50; i++) { // Nhiều hạt hơn
      particles.push(new Particle(x, y));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('click', (e) => createSplash(e.clientX, e.clientY));
  animate();
});