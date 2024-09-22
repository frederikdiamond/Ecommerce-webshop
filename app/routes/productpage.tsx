/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCallback, useState } from "react";
import CustomerReviewSection from "~/components/CustomerReviewSection";
import { FullscreenImage } from "~/components/FullscreenImage";
import { ArrowIcom } from "~/components/Icons";
import { formatPrice } from "~/helpers/formatPrice";

const productPage = {
  id: 1,
  productName: "MacBook Pro 16”",
  productDescription: "The most powerful MacBook ever.",
  productSpecifications: [
    "16-inch Retina display",
    "M1 Pro or M1 Max chip",
    "Up to 64GB of unified memory",
    "Up to 8TB of SSD storage",
  ],
  productPrice: 2399,
};

export default function ProductPage({
  productName,
  productDescription,
  productSpecifications,
  productPrice,
  productImages,
}: {
  productName: string;
  productDescription: string;
  productSpecifications: string[];
  productPrice: number;
  productImages: string[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const images = [
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery2-202310_GEO_DK?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1698156926558",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery3-202310?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1697311164734",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery4-202310?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1697311165217",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery5-202310?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1697311166953",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery6-202310?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1697311170821",
  ];

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  return (
    <main className="mt-16 flex flex-col items-center gap-20">
      <div className="grid h-screen w-[1000px] grid-cols-2 gap-10">
        <div className="w-full">
          <div className="sticky top-36">
            <div
              onClick={handleImageClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative h-96 cursor-pointer"
            >
              <img
                src={images[currentIndex]}
                alt={`Product ${currentIndex + 1}`}
                className="absolute h-full w-full rounded-2xl object-cover"
              />
            </div>
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
                      ? "scale-125 bg-black"
                      : "bg-black/30 hover:bg-black/80"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-36">
          <div>
            <h1 className="text-3xl font-bold">{productPage.productName}</h1>
            <p className="mt-3.5 text-lg font-medium">
              {productPage.productDescription}
            </p>
            {/* If product is configurable, show button to configure. */}
            <ul className="mt-4 list-disc pl-5 text-sm leading-loose opacity-75">
              {productPage.productSpecifications.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
            <button className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline">
              Edit Configuration
            </button>
            <p className="mt-8 text-xl font-medium">
              {formatPrice(productPage.productPrice)}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-5">
            <button className="h-12 w-32 rounded-xl bg-gradient-to-b from-[#0EBEFE] to-[#312FAD] text-center font-semibold text-white transition duration-200 ease-in-out hover:scale-105 active:scale-95">
              Buy it Now
            </button>
            <button className="h-12 w-32 rounded-xl text-center font-semibold text-black transition-all duration-200 ease-in-out hover:bg-black/10 active:scale-95 active:bg-black/20">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="w-[950px]">
        <CustomerReviewSection />
        <div>
          <h2 className="text-lg font-medium">Product Recommendations</h2>
        </div>
      </div>

      {isFullscreen && (
        <FullscreenImage
          images={images}
          initialIndex={currentIndex}
          onClose={handleCloseFullscreen}
        />
      )}
    </main>
  );
}
