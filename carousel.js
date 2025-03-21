const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = React.useState(2);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);
  const autoplayRef = React.useRef(null);
  const images = ["noibat2.png", "noibat3.png", "noibat4.png", "noibat5.png", "noibat6.png"];

  const prevSlide = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const goToSlide = (index) => setActiveIndex(index);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setAutoplay(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    if (Math.abs(startX - currentX) > 50) {
      startX > currentX ? nextSlide() : prevSlide();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setAutoplay(true);
  };

  React.useEffect(() => {
    if (autoplay) autoplayRef.current = setInterval(nextSlide, 2000); // Nhanh hơn
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, activeIndex]);

  const getSlideClass = (index) => {
    let position = "", size = "", elevation = "", opacity = "", rotate = "";
    if (index === activeIndex) {
      position = "translate-x-0";
      size = "scale-125 z-30"; // Phóng to mạnh hơn
      elevation = "-translate-y-10 translateZ(50px)"; // Nhô ra 3D
      opacity = "opacity-100 brightness-150";
      rotate = "rotateY(0deg)";
    } else if (index === activeIndex - 1 || (activeIndex === 0 && index === images.length - 1)) {
      position = "-translate-x-[70%]"; // Xa hơn
      size = "scale-90 z-20";
      elevation = "-translate-y-4 translateZ(50px)"; // Nhô ra 3D
      opacity = "opacity-80";
      rotate = "rotateY(-45deg)"; // Xoay mạnh hơn
    } else if (index === activeIndex + 1 || (activeIndex === images.length - 1 && index === 0)) {
      position = "translate-x-[150%]"; // Xa hơn
      size = "scale-90 z-20";
      elevation = "-translate-y-4 translateZ(50px)"; // Nhô ra 3D
      opacity = "opacity-80";
      rotate = "rotateY(45deg)"; // Xoay mạnh hơn
    } else {
      position = index < activeIndex ? "-translate-x-[200%] -ml-24" : "translate-x-[200%] ml-24";
      size = "scale-75 z-10";
      elevation = "translate-y-0";
      opacity = "opacity-60";
      rotate = "rotateY(0deg)";
    }
    return `absolute transform transition-all duration-200 ${position} ${size} ${elevation} ${opacity} ${rotate}`; // Nhanh hơn
  };

  return (
    <div className="carousel-background h-full flex items-center justify-center bg-[#f0f9f4] overflow-hidden"
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart} onMouseMove={handleTouchMove} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
      <h2 className="carousel-title absolute top-4 left-4 text-xl font-semibold text-green-800 z-50">Các Sản Phẩm Nổi Bật</h2>
      <div className="flex justify-between absolute inset-0 items-center px-6 z-40">
        <button className="nav-arrow bg-white/70 p-3 rounded-full shadow-md hover:bg-white/90 hover:scale-125" onClick={prevSlide}>←</button>
        <button className="nav-arrow bg-white/70 p-3 rounded-full shadow-md hover:bg-white/90 hover:scale-125" onClick={nextSlide}>→</button>
      </div>
      <div className="relative w-full h-full flex justify-center items-center perspective-1000">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Sản phẩm ${index + 1}`} className={`${getSlideClass(index)} object-contain milk-glow`}
            style={{ width: index === activeIndex ? '450px' : '380px', height: index === activeIndex ? '520px' : '440px' }}
            onClick={() => goToSlide(index)} />
        ))}
      </div>
      <div className="absolute bottom-4 flex justify-center gap-2 z-40">
        {images.map((_, index) => (
          <button key={index} className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-green-600 w-8' : 'bg-gray-300'}`}
            onClick={() => goToSlide(index)} />
        ))}
      </div>
      <div className="absolute top-4 right-4 z-40">
        <button className={`p-2 rounded-lg font-medium ${autoplay ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Auto' : 'Manual'}</button>
      </div>
    </div>
  );
};

ReactDOM.render(<ImageCarousel />, document.getElementById('carousel-container'));