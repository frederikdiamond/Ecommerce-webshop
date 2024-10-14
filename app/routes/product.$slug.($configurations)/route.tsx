/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
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
  shoppingCartItemConfigurations,
  shoppingCartItems,
} from "~/db/schema.server";
import { formatPrice } from "~/helpers/formatPrice";
import { Product } from "~/types/ProductTypes";
import { authenticator } from "../services/auth.server";
import SuccessMessage from "~/components/SuccessMessage";

type ConfigOption = {
  label: string;
  price: number;
};

type ConfigCategory = {
  name: string;
  options: ConfigOption[];
  defaultOption?: ConfigOption;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const productId = formData.get("productId");
  const price = formData.get("price");
  const configurations = JSON.parse(formData.get("configurations") as string);

  if (!productId || !price || !configurations) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    const [cartItem] = await db
      .insert(shoppingCartItems)
      .values({
        userId: user.id,
        productId: Number(productId),
        price: Number(price),
        quantity: 1,
      })
      .returning();

    const configInserts = Object.entries(configurations).map(
      ([category, optionId]) => ({
        cartItemId: cartItem.id,
        optionId: Number(optionId),
      }),
    );

    await db.insert(shoppingCartItemConfigurations).values(configInserts);

    return json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return json({ error: "Failed to add product to cart" }, { status: 500 });
  }
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

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
        id: productOptions.id,
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
        const option = {
          id: row.id,
          label: row.optionLabel,
          price: row.priceModifier,
        };
        category.options.push(option);
        if (row.isDefault) {
          category.defaultOption = option;
        }
        return acc;
      },
      [],
    );

    const initialSelectedConfigurations: Record<string, ConfigOption> = {};
    configurations.forEach((category) => {
      const paramValue = searchParams.get(category.name.toLowerCase());
      const selectedOption =
        category.options.find(
          (o) => o.label.toLowerCase() === paramValue?.toLowerCase(),
        ) || category.defaultOption;
      if (selectedOption) {
        initialSelectedConfigurations[category.name] = selectedOption;
      }
    });

    return json({
      product,
      configurations,
      initialSelectedConfigurations,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Response("Server Error", { status: 500 });
  }
};

export default function ProductPage() {
  const { product, configurations, initialSelectedConfigurations } =
    useLoaderData<{
      product: Product;
      configurations: ConfigCategory[];
      initialSelectedConfigurations: Record<string, ConfigOption>;
    }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEditConfiguration, setShowEditConfiguration] = useState(false);
  const [selectedConfigurations, setSelectedConfigurations] = useState(
    initialSelectedConfigurations,
  );
  const [currentSpecifications, setCurrentSpecifications] = useState<string[]>(
    [],
  );
  const [successMessageTrigger, setSuccessMessageTrigger] = useState(0);
  const fetcher = useFetcher();

  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const updateUrl = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(selectedConfigurations).forEach(([category, option]) => {
      newSearchParams.set(category.toLowerCase(), option.label.toLowerCase());
    });

    setSearchParams(newSearchParams, { replace: true });
  }, [selectedConfigurations, setSearchParams, searchParams]);

  useEffect(() => {
    updateUrl();
    if (hasConfigurations) {
      updateSpecifications();
    }
  }, [selectedConfigurations, updateUrl]);

  const updateSpecifications = () => {
    const updatedSpecs = Object.entries(selectedConfigurations).map(
      ([category, option]) => `${category}: ${option.label}`,
    );
    setCurrentSpecifications(updatedSpecs);
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

  const toggleConfigurationView = () => {
    setShowEditConfiguration(!showEditConfiguration);
  };

  const calculateTotalPrice = () => {
    const additionalCost = Object.values(selectedConfigurations).reduce(
      (sum, option) => sum + option.price,
      0,
    );
    return product.basePrice + additionalCost;
  };

  const handleAddToCart = () => {
    const configurationIds = Object.entries(selectedConfigurations).reduce(
      (acc, [category, option]) => {
        if (option.id) {
          acc[category] = option.id;
        }
        return acc;
      },
      {},
    );

    fetcher.submit(
      {
        productId: product.id.toString(),
        price: calculateTotalPrice().toString(),
        configurations: JSON.stringify(configurationIds),
      },
      { method: "post" },
    );

    setSuccessMessageTrigger((prev) => prev + 1);
  };

  const hasConfigurations = configurations.length > 0;

  return (
    <main className="mt-16 flex flex-col items-center gap-20">
      <SuccessMessage
        text="Product added to cart"
        triggerShow={successMessageTrigger}
      />
      <div className="grid h-screen w-[1000px] grid-cols-2 gap-10">
        <div className="w-full">
          <div className="sticky top-36">
            <div
              onClick={handleImageClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative h-96 cursor-pointer rounded-2xl"
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
            <ul className="mt-4 list-disc pl-5 text-sm leading-loose opacity-75">
              {hasConfigurations
                ? currentSpecifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))
                : product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
            </ul>
            {hasConfigurations && (
              <button
                onClick={toggleConfigurationView}
                className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline"
              >
                {showEditConfiguration
                  ? "Save Configuration"
                  : "Edit Configuration"}
              </button>
            )}

            {showEditConfiguration && hasConfigurations && (
              <div className="mt-4 space-y-4">
                {configurations.map((category) => (
                  <div key={category.name}>
                    <p className="font-semibold">{category.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {category.options
                        .sort((a, b) => a.price - b.price)
                        .map((option) => (
                          <button
                            key={`${category.name}-${option.label}`}
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
            <button
              onClick={handleAddToCart}
              disabled={fetcher.state === "submitting"}
              className="h-12 w-32 rounded-xl text-center font-semibold text-black transition-all duration-200 ease-in-out hover:bg-black/10 active:scale-95 active:bg-black/20"
            >
              {fetcher.state === "submitting" ? "Adding..." : "Add to Cart"}
            </button>
            {/* {fetcher.data?.success && (
              <p className="mt-2 text-green-500">
                Product added to cart successfully!
              </p>
            )} */}
            {fetcher.data?.error && (
              <p className="mt-2 text-red-500">{fetcher.data.error}</p>
            )}
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
