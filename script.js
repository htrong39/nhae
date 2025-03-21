document.addEventListener('DOMContentLoaded', () => {
  VanillaTilt.init(document.querySelectorAll('.danhmucnoibat-item, .product-grid > div, .store-info, .contact-form'), {
    max: 25, // Góc nghiêng lớn hơn
    speed: 300, // Nhanh hơn
    glare: true,
    'max-glare': 0.2, // Ánh sáng mạnh hơn
  });

  document.querySelectorAll('.background-container01').forEach((section) => {
    section.classList.add('parallax-section');
    const img = section.querySelector('.tunhien');
    if (img) img.classList.add('parallax-img');

    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const speed = section.dataset.speed || 0.3; // Tăng tốc độ
      if (img) {
        img.style.transform = `translateX(${x * 100 * speed}px) translateY(${y * 100 * speed}px) rotateX(${y * 20}deg) rotateY(${-x * 20}deg) translateZ(50px)`; // 3D mạnh hơn
      }
    });

    section.addEventListener('mouseleave', () => {
      if (img) {
        img.style.transform = 'translateX(0) translateY(0) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }
    });
  });
});