export type ConfigOption = {
  id: number;
  label: string;
  price: number;
};

export type ConfigCategory = {
  name: string;
  options: ConfigOption[];
  defaultOption?: ConfigOption | null;
};
