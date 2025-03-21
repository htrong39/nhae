window.addEventListener("scroll", function() {
    const parallax = document.getElementById("parallax-section");
    // Điều chỉnh tốc độ cuộn của ảnh nền (0.5 là tốc độ mặc định)
    let scrollPosition = window.pageYOffset;
    parallax.style.backgroundPositionY = (scrollPosition * 0.5) + "px";
  });
  