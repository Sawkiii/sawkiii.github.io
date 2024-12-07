import React, {
  TouchEventHandler,
  TouchEvent,
  TouchList,
  Touch,
  useState,
} from "react";

const Gallery = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>();

  const slides = [
    "bilder/rochen.jpg",
    "bilder/octopus.jpg",
    "bilder/sunflower.jpg",
    "bilder/unicorn.jpg",
    "whale.jpg",
    "bilder/women.jpg",
    "bilder/wald.jpg",
    "bilder/whiskey.jpeg",
  ];

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const openOverlay = (image: string) => {
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setSelectedImage(undefined);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance: number = 50;

  const isValidTargetTouches = (targetTouches: TouchList) => {
    return targetTouches.length > 0;
  };

  const handleInvalidTargetTouches = () => {
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onTouchStart: TouchEventHandler<HTMLDivElement> = (e: TouchEvent) => {
    setTouchEnd(null); // Otherwise the swipe is fired even with usual touch events

    let targetTouches: TouchList = e.targetTouches;
    if (!isValidTargetTouches(targetTouches)) {
      handleInvalidTargetTouches();
      return;
    }

    let touch: Touch = targetTouches[0];
    let clientX: number = touch.clientX;

    setTouchStart(clientX);
  };

  const onTouchMove: TouchEventHandler<HTMLDivElement> = (e: TouchEvent) => {
    let targetTouches: TouchList = e.targetTouches;
    if (!isValidTargetTouches(targetTouches)) {
      handleInvalidTargetTouches();
      return;
    }

    let touch: Touch = targetTouches[0];
    let clientX: number = touch.clientX;

    setTouchEnd(clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section
      id="gallery"
      className="relative bg-cover bg-center py-10 flex-grow w-full"
    >
      <div className="p-4 bg-base-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Galerie</h2>
        <div
          className="carousel w-full h-96 pb-4 relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="carousel-inner flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                className="carousel-item w-full flex-shrink-0"
                key={index}
                onClick={() => openOverlay(slide)}
              >
                <img
                  src={slide}
                  className="w-full h-full object-contain cursor-pointer pb-3"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 w-full">
            <button onClick={prevSlide} className="btn btn-circle shadow-lg">
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="btn btn-circle mr-10 shadow-lg"
            >
              ❯
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: slides.length }).map((_, index) => (
            <span
              key={"slide" + index}
              className={`w-3 h-3 rounded-full mx-1 cursor-pointer transition-transform duration-300 shadow-lg ${
                currentSlide === index
                  ? "bg-orange-500 h-6 w-6 transform -translate-y-2"
                  : "bg-gray-400"
              }`}
              onClick={() => {
                setCurrentSlide(index);
              }}
            ></span>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeOverlay}
        >
          <div className="max-w-4xl max-h-4xl">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
