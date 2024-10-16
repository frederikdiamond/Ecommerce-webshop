export type ConfigOption = {
  label: string;
  price: number;
};

export type ConfigCategory = {
  name: string;
  options: ConfigOption[];
  defaultOption?: ConfigOption;
};
