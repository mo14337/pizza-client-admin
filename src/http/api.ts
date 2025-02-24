import { CreateUser } from "../store";
import { ICredentials, Tenant } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/auth-service";
export const CATALOG_SERVICE = "/catalog-service";
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
  api.get(`/${AUTH_SERVICE}tenants?${queryString}`);
export const createTenant = (data: Tenant) =>
  api.post(`${AUTH_SERVICE}/tenants`, data);
export const updateTenant = (data: Tenant, id: number) =>
  api.patch(`${AUTH_SERVICE}/tenants/${id}`, data);
