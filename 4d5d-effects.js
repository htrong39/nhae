document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  function createExtremeMilkWave(x, y) {
      const wave = document.createElement('div');
      wave.className = 'milk-wave';
      wave.style.left = `${x - 300}px`; // Canh giữa
      wave.style.top = `${y - 300}px`;
      wave.style.width = '1000px'; // Sóng cực to
      wave.style.height = '1000px';
      wave.style.background = 'rgba(255, 255, 255, 1)';
      wave.style.borderRadius = '50%';
      wave.style.position = 'absolute';
      wave.style.opacity = '0.9';
      wave.style.animation = 'waveExpand 0.5s ease-out forwards';
      body.appendChild(wave);

      setTimeout(() => wave.remove(), 500);
  }

  function createUltraRapidMilkDrop() {
      for (let i = 0; i < 20; i++) { // Rơi siêu nhiều giọt
          setTimeout(() => {
              const drop = document.createElement('div');
              drop.className = 'milk-drop';
              drop.style.left = `${Math.random() * window.innerWidth}px`;
              drop.style.width = '40px'; // Giọt cực to
              drop.style.height = '80px';
              drop.style.animationDuration = '0.5s'; // Rơi siêu nhanh
              drop.style.background = 'rgba(255, 255, 255, 1)';
              drop.style.borderRadius = '50%';
              body.appendChild(drop);
              setTimeout(() => drop.remove(), 700);
          }, i * 30); // Xuất hiện liên tiếp siêu nhanh
      }
  }

  document.addEventListener('click', (e) => {
      createExtremeMilkWave(e.clientX, e.clientY);
      createUltraRapidMilkDrop();
  });

  // Cường hóa hiệu ứng hover sáng mạnh nhất
  document.querySelectorAll('.milk-glow').forEach(element => {
      element.addEventListener('mouseenter', () => {
          element.style.transform = 'scale(1.5) rotate(5deg)';
          element.style.boxShadow = '0 0 150px rgba(255, 255, 255, 1), 0 0 250px rgba(255, 255, 255, 1)';
          element.style.filter = 'brightness(2)';
      });
      element.addEventListener('mouseleave', () => {
          element.style.transform = 'scale(1) rotate(0deg)';
          element.style.boxShadow = '';
          element.style.filter = '';
      });
  });

  // Thêm hiệu ứng animation cho sóng lan rộng
  const style = document.createElement('style');
  style.innerHTML = `
      @keyframes waveExpand {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(10); opacity: 0; }
      }
  `;
  document.head.appendChild(style);
});