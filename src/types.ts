export interface ICredentials {
  email: string;
  password: string;
  remember: boolean;
}

export type Tenant = {
  address: string;
  name: string;
  id: number;
};

export type FieldData = {
  name: string;
  value?: string;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Attribute {
  _id?: string;
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface ICategory {
  _id?: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

interface priceConfiguration {
  priceType: string;
  availableOptions: Map<string, number>;
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  image: string;
  priceConfiguration: Map<string, priceConfiguration>;
  attributes: {
    name: string;
    value: string | number;
  }[];
  tenantId: string;
  categoryId: string;
  isPublish: boolean;
  createdAt: string;
}
export type ImageFiled = { file: File };
export type CreateProductData = IProduct & { image: ImageFiled };
