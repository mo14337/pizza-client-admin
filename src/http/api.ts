import { CreateUser } from "../store";
import { ICredentials, Tenant } from "../types";
import { api } from "./client";

//Auth service
export const login = (credetials: ICredentials) =>
  api.post("/auth/login", credetials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");

// users
export const getUsers = (queryString: string) =>
  api.get(`/users?${queryString}`);
export const createUsers = (data: CreateUser) => api.post("/users", data);
export const updateUser = (data: CreateUser, id: number) =>
  api.patch(`/users/${id}`, data);

//tenants
export const getTenants = (queryString?: string) =>
  api.get(`/tenants?${queryString}`);
export const createTenant = (data: Tenant) => api.post("/tenants", data);
export const updateTenant = (data: Tenant, id: number) =>
  api.patch(`/tenants/${id}`, data);
