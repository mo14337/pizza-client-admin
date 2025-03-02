import { CreateProductData } from "../../../types";

export const makeFormData = (product: CreateProductData) => {
  const formData = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    if (key === "image") {
      //   console.log(value.file);
      formData.append(key, value.file);
    } else if (key === "priceConfiguration" || key === "attributes") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
