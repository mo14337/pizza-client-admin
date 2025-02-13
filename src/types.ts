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
