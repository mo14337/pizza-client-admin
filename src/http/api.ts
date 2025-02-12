import { CreateUser } from "../store";
import { ICredentials, Tenant } from "../types";
import { api } from "./client";

//Auth service
export const login = (credetials: ICredentials) =>
  api.post("/auth/login", credetials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");

// users
export const getUsers = () => api.get("/users");
export const createUsers = (data: CreateUser) => api.post("/users", data);

//tenants
export const getTenants = () => api.get("/tenants");
export const createTenant = (data: Tenant) => api.post("/tenants", data);
