import { useEffect, useRef, useState } from "react";
import ProductCard from "../ProductCard";
import { Product } from "~/types/ProductTypes";

interface LatestProductsProps {
  products: Product[];
}

export default function NewestProducts({ products }: LatestProductsProps) {
  const [rightGradientOpacity, setRightGradientOpacity] = useState(1);
  const [leftGradientOpacity, setLeftGradientOpacity] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateGradientOpacity = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const startFadeRightPoint = maxScrollLeft * 0.95;
      const startFadeLeftPoint = maxScrollLeft * 0.05;

      if (scrollLeft >= startFadeRightPoint) {
        const rightOpacity =
          1 -
          (scrollLeft - startFadeRightPoint) /
            (maxScrollLeft - startFadeRightPoint);
        setRightGradientOpacity(rightOpacity > 0 ? rightOpacity : 0);
      } else {
        setRightGradientOpacity(1);
      }

      if (scrollLeft <= startFadeLeftPoint) {
        const leftOpacity = scrollLeft / startFadeLeftPoint;
        setLeftGradientOpacity(leftOpacity > 0 ? leftOpacity : 0);
      } else {
        setLeftGradientOpacity(1);
      }
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", updateGradientOpacity);
      return () => {
        slider.removeEventListener("scroll", updateGradientOpacity);
      };
    }
  }, []);

  if (!products || products.length === 0) {
    return <div className="no-products-message">No newest products found.</div>;
  }

  return (
    <div>
      <h2 className="mb-3 text-2xl font-medium">Newest Products</h2>
      <div className="relative w-full">
        <div ref={sliderRef} className="flex gap-5 overflow-x-auto pb-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              slug={product.slug}
              name={product.name}
              specifications={product.specifications || []}
              price={product.price}
              images={product.images || ""}
            />
          ))}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-[200px] bg-gradient-to-l from-white to-transparent"
            style={{ opacity: rightGradientOpacity }}
          />
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-[200px] bg-gradient-to-r from-white to-transparent"
            style={{ opacity: leftGradientOpacity }}
          />
        </div>
      </div>
    </div>
  );
}
