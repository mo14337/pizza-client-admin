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
