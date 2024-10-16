import { useEffect, useState } from "react";
import { Product } from "~/types/ProductTypes";
import { ConfigCategory, ConfigOption } from "~/types/ConfigTypes";

export type SelectedConfigurations = Record<string, ConfigOption>;

export function useProductConfiguration(
  product: Product,
  configurations: ConfigCategory[],
  initialSelectedConfigurations: SelectedConfigurations,
) {
  const [selectedConfigurations, setSelectedConfigurations] =
    useState<SelectedConfigurations>(initialSelectedConfigurations);
  const [currentSpecifications, setCurrentSpecifications] = useState<string[]>(
    [],
  );

  const hasConfigurations = configurations.length > 0;

  useEffect(() => {
    if (hasConfigurations) {
      updateSpecifications();
    }
  }, [selectedConfigurations, hasConfigurations]);

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

  const calculateTotalPrice = () => {
    const additionalCost = Object.values(selectedConfigurations).reduce(
      (sum, option) => sum + option.price,
      0,
    );
    return product.basePrice + additionalCost;
  };

  const getDisplaySpecifications = () => {
    return hasConfigurations ? currentSpecifications : product.specifications;
  };

  return {
    selectedConfigurations,
    currentSpecifications,
    hasConfigurations,
    handleConfigurationChange,
    calculateTotalPrice,
    getDisplaySpecifications,
  };
}

export function constructProductUrl(
  baseSlug: string | undefined,
  configurations: SelectedConfigurations,
) {
  if (!baseSlug) return "";

  const configParams = Object.entries(configurations)
    .map(
      ([category, option]) =>
        `${category.toLowerCase()}=${encodeURIComponent(option.label.toLowerCase())}`,
    )
    .join("&");

  return `/product/${baseSlug}${configParams ? `?${configParams}` : ""}`;
}
