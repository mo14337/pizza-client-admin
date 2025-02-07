import { ICredentials } from "../types";
import { api } from "./client";

//Auth service
export const login = (credetials: ICredentials) =>
  api.post("/auth/login", credetials);

export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
