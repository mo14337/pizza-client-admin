import { CreateUser } from "../store";
import { ICredentials, IProduct, OrderStatus, Tenant } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/auth-service";
export const CATALOG_SERVICE = "/catalog-service";
export const ORDER_SERVICE = "/billing";
//localhost:8000/billing/order/orders

//Auth service
export const login = (credetials: ICredentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credetials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const createUsers = (data: CreateUser) =>
  api.post(`${AUTH_SERVICE}/users`, data);
export const updateUser = (data: CreateUser, id: number) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, data);
export const getTenants = (queryString?: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createTenant = (data: Tenant) =>
  api.post(`${AUTH_SERVICE}/tenants`, data);
export const updateTenant = (data: Tenant, id: number) =>
  api.patch(`${AUTH_SERVICE}/tenants/${id}`, data);

//catalog service

export const getCategories = (queryString?: string) =>
  api.get(`${CATALOG_SERVICE}/category?${queryString && queryString}`);
export const getProducts = (queryString?: string) =>
  api.get(`${CATALOG_SERVICE}/product?${queryString && queryString}`);
export const createProduct = (product: IProduct) =>
  api.post(`${CATALOG_SERVICE}/product`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getCategory = (id?: string) =>
  api.get(`${CATALOG_SERVICE}/category/${id}`);
export const updateProduct = (product: IProduct, id: string) =>
  api.put(`${CATALOG_SERVICE}/product/${id}`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// billing service

export const getOrders = (queryString: string) =>
  api.get(`${ORDER_SERVICE}/order?${queryString}`);
export const getSingle = (orderId: string, queryString: string) =>
  api.get(`${ORDER_SERVICE}/order/orders/${orderId}?${queryString}`);
export const changeStatus = (orderId: string, data: { status: OrderStatus }) =>
  api.patch(`${ORDER_SERVICE}/orders/change-status/${orderId}`, data);
