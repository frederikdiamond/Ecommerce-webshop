/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcom, CloseIcon } from "./Icons";

interface FullscreenImageProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isHovering, setIsHovering] = useState(false);

  const handleBackgroundClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    },
    [onClose],
  );

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      onClick={handleBackgroundClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="fixed bottom-0 left-0 right-0 top-0 z-[99] flex items-center justify-center bg-black/90"
    >
      <button
        onClick={onClose}
        className="absolute right-10 top-10 flex items-center justify-center rounded-full bg-white/5 fill-white/50 p-2 transition duration-200 ease-in-out hover:bg-white/10 hover:fill-white active:bg-white/25"
      >
        <CloseIcon className="size-10" />
      </button>

      <img
        ref={imageRef}
        src={images[currentIndex]}
        alt={`Product ${currentIndex + 1}`}
        className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
      />
      <button
        onClick={goToPrevious}
        onMouseEnter={() => setIsHovering(true)}
        className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 ease-in-out hover:scale-110 hover:bg-white active:scale-95 ${
          isHovering ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Previous image"
      >
        <ArrowIcom className="size-6 rotate-180" />
      </button>
      <button
        onClick={goToNext}
        onMouseEnter={() => setIsHovering(true)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 ease-in-out hover:scale-110 hover:bg-white active:scale-95 ${
          isHovering ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Next image"
      >
        <ArrowIcom className="size-6" />
      </button>
      <div
        className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 transition-all duration-200 ease-in-out ${isHovering ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            onMouseEnter={() => setIsHovering(true)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "scale-125 bg-white"
                : "bg-white/30 hover:bg-white/80"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
