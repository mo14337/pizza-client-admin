/* eslint-disable @typescript-eslint/no-explicit-any */
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
  category: ICategory;
  isPublish: boolean;
  createdAt: string;
}
export type ImageFiled = { file: File };
export type CreateProductData = IProduct & { image: ImageFiled };

export enum OrderStatus {
  RECEIVED = "received",
  CONFIRMED = "confirmed",
  PREPARED = "prepared",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum PaymentMode {
  CARD = "card",
  CASH = "cash",
}

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export interface CartItem
  extends Pick<IProduct, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  _id: string;
  image: any;
  cart: CartItem[];
  customerId: Customer;
  total: number;
  discount: number;
  taxes: number;
  deliveryCharges: number;
  address: string;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
}

export enum OrderEvents {
  ORDER_CREATE = "ORDER_CREATE",
  PAYMENT_STATUS_UPDATE = "PAYMENT_STATUS_UPDATE",
  ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE",
}
