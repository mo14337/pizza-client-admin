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
