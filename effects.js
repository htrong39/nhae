document.addEventListener('DOMContentLoaded', () => {
  VanillaTilt.init(document.querySelectorAll('.danhmucnoibat-item, .product-grid > div, .store-info, .contact-form'), {
    max: 15,
    speed: 400,
    glare: true,
    'max-glare': 0.5,
  });

  document.querySelectorAll('.background-container01').forEach((section) => {
    section.classList.add('parallax-section');
    const img = section.querySelector('.tunhien');
    if (img) img.classList.add('parallax-img');

    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const speed = section.dataset.speed || 0.2;
      const img = section.querySelector('.parallax-img');
      if (img) {
        img.style.transform = `translateX(${x * 50 * speed}px) translateY(${y * 50 * speed}px) rotateX(${y * 10}deg) rotateY(${-x * 10}deg)`;
      }
    });

    section.addEventListener('mouseleave', () => {
      const img = section.querySelector('.parallax-img');
      if (img) {
        img.style.transform = 'translateX(0) translateY(0) rotateX(0deg) rotateY(0deg)';
      }
    });
  });
});









