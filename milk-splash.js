document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Hiệu ứng sóng sữa khi click - 4D
  function createExtremeMilkWave(x, y) {
    const wave = document.createElement('div');
    wave.className = 'milk-wave';
    wave.style.left = `${x - 1500}px`; // Canh giữa với kích thước lớn
    wave.style.top = `${y - 1500}px`;
    wave.style.width = '3000px'; // Sóng siêu to
    wave.style.height = '3000px';
    wave.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0), transparent)';
    wave.style.boxShadow = '0 0 50px rgba(250, 250, 250, 0)'; /* Ánh sáng */
    wave.style.borderRadius = '50%';
    wave.style.position = 'absolute';
    wave.style.opacity = '1';
    wave.style.animation = 'waveExpand 0.4s ease-out forwards';
    body.appendChild(wave);
    setTimeout(() => wave.remove(), 400); // Nhanh hơn
  }

  // Hiệu ứng giọt sữa rơi - 5D
  function createUltraRapidMilkDrop(x, y) {
    for (let i = 0; i < 100; i++) { // Rơi siêu nhiều giọt
      setTimeout(() => {
        const drop = document.createElement('div');
        drop.className = 'milk-drop';
        drop.style.left = `${x + (Math.random() - 0.5) * 400}px`; // Phân tán rộng hơn
        drop.style.top = `${y + (Math.random() - 0.5) * 400}px`;
        drop.style.width = '20px'; // To hơn
        drop.style.height = '40px';
        drop.style.animationDuration = `${Math.random() * 0.4 + 0.2}s`; // Tốc độ ngẫu nhiên
        drop.style.background = 'rgba(255, 255, 255, 0.04)';
        drop.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.02)'; /* Ánh sáng */
        drop.style.borderRadius = '50%';
        body.appendChild(drop);
        setTimeout(() => drop.remove(), 600);
      }, i * 10); // Xuất hiện liên tiếp nhanh hơn
    }
  }

  // Gắn sự kiện click
  document.addEventListener('click', (e) => {
    createExtremeMilkWave(e.clientX, e.clientY);
    createUltraRapidMilkDrop(e.clientX, e.clientY);
  });

  // Hiệu ứng hover - 4D
  document.querySelectorAll('.milk-glow').forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.2) rotate(3deg)'; // Giảm mức phóng to và xoay
      element.style.boxShadow = '0 0 20px rgba(180, 200, 255, 0.55), 0 0 40px rgba(180, 200, 255, 0.22)'; // Ánh sáng nhẹ hơn
      element.style.filter = 'brightness(1.1)'; // Giảm độ sáng
      createUltraRapidMilkDrop(element.getBoundingClientRect().left + element.offsetWidth / 2, 
                              element.getBoundingClientRect().top + element.offsetHeight / 2); // Giọt sữa khi hover
    });
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1) rotateY(0deg) translateZ(0)';
      element.style.boxShadow = '';
      element.style.filter = '';
    });
  });
});