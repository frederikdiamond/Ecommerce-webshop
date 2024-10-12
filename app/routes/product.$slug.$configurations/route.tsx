/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import CustomerReviewSection from "~/components/CustomerReviewSection";
import { FullscreenImage } from "~/components/FullscreenImage";
import { ArrowIcom } from "~/components/Icons";
import { db } from "~/db/index.server";
import {
  productConfigurations,
  productOptions,
  products,
} from "~/db/schema.server";
import { formatPrice } from "~/helpers/formatPrice";
import { Product } from "~/types/ProductTypes";

type ConfigOption = {
  label: string;
  price: number;
};

type ConfigCategory = {
  name: string;
  options: ConfigOption[];
  defaultOption?: ConfigOption;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    throw new Response("Bad Request", { status: 400 });
  }

  try {
    const productResult = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    if (!productResult || productResult.length === 0) {
      throw new Response("Product Not Found", { status: 404 });
    }

    const product = productResult[0];

    const configResults = await db
      .select({
        category: productConfigurations.category,
        optionLabel: productOptions.optionLabel,
        priceModifier: productOptions.priceModifier,
        isDefault: productOptions.isDefault,
      })
      .from(productConfigurations)
      .leftJoin(
        productOptions,
        eq(productOptions.configurationId, productConfigurations.id),
      )
      .where(eq(productConfigurations.productId, product.id));

    const configurations = configResults.reduce(
      (acc: ConfigCategory[], row) => {
        let category = acc.find((c) => c.name === row.category);
        if (!category) {
          category = { name: row.category, options: [], defaultOption: null };
          acc.push(category);
        }
        const option = { label: row.optionLabel, price: row.priceModifier };
        category.options.push(option);
        if (row.isDefault) {
          category.defaultOption = option;
        }

        // category.options.push({
        //   label: row.optionLabel,
        //   price: row.priceModifier,
        // });
        return acc;
      },
      [],
    );
    return json({ product, configurations });

    // const product: Product = productResult[0];
    // return json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Response("Server Error", { status: 500 });
  }
};

export default function ProductPage() {
  // const { product } = useLoaderData<{ product: Product }>();
  const { product, configurations } = useLoaderData<{
    product: Product;
    configurations: ConfigCategory[];
  }>();
  const params = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEditConfiguration, setShowEditConfiguration] = useState(false);
  const [selectedConfigurations, setSelectedConfigurations] = useState<
    Record<string, ConfigOption>
  >(() => {
    const defaults: Record<string, ConfigOption> = {};
    configurations.forEach((category) => {
      if (category.defaultOption) {
        defaults[category.name] = category.defaultOption;
      }
    });
    return defaults;
  });

  const buildProductUrl = () => {
    const url = `/product/${product.slug}`;
    const configStrings = Object.entries(selectedConfigurations)
      .map(([category, option]) => {
        const formattedCategory = category.toLowerCase().replace(/\s+/g, "-");
        const formattedOption = option.label.toLowerCase().replace(/\s+/g, "-");
        return `${formattedCategory}-${formattedOption}`;
      })
      .join("-");
    return `${url}/${configStrings}`;
  };

  useEffect(() => {
    if (Object.keys(selectedConfigurations).length > 0) {
      const newUrl = buildProductUrl();
      navigate(newUrl, { replace: true });
    }
  }, [selectedConfigurations]);

  if (!product) {
    return <div>Product not found: {params.slug}</div>;
  }

  const images = product.images || [product.images];

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

  const toggleConfigurationView = () => {
    setShowEditConfiguration(!showEditConfiguration);
  };

  const handleConfigurationChange = (
    category: string,
    option: ConfigOption,
  ) => {
    setSelectedConfigurations((prev) => ({
      ...prev,
      [category]: option,
    }));
  };

  const calculateTotalPrice = () => {
    const additionalCost = Object.values(selectedConfigurations).reduce(
      (sum, option) => sum + option.price,
      0,
    );
    return product.basePrice + additionalCost;
  };

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
                className="absolute h-full w-full rounded-2xl object-contain"
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
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-3.5 text-lg font-medium">{product.description}</p>
            {/* If product is configurable, show button to configure. */}
            <ul className="mt-4 list-disc pl-5 text-sm leading-loose opacity-75">
              {product.specifications.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
            <button
              onClick={toggleConfigurationView}
              className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline"
            >
              {showEditConfiguration
                ? "Save Configuration"
                : "Edit Configuration"}
            </button>
            {showEditConfiguration && (
              <div className="mt-4 space-y-4">
                {configurations.map((category) => (
                  <div key={category.name}>
                    <p className="font-semibold">{category.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {category.options
                        .sort((a, b) => a.price - b.price)
                        .map((option) => (
                          <button
                            key={option.label}
                            onClick={() =>
                              handleConfigurationChange(category.name, option)
                            }
                            className={`rounded-md px-3 py-1 text-sm transition duration-200 ${
                              selectedConfigurations[category.name]?.label ===
                              option.label
                                ? "bg-blue-500 text-white active:bg-blue-600"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400"
                            }`}
                          >
                            {option.label}
                            {option.price > 0 &&
                              ` (+${formatPrice(option.price)})`}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-8 text-xl font-medium">
              {formatPrice(calculateTotalPrice())}
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
