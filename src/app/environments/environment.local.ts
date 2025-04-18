import { Environment } from "../models/product.interface";

export const environment: Environment  = {
  production: false,
  apiUrl: 'http://localhost:3000',
  featureFlags: {
    enableGraphQLApi: true,
  },
};
