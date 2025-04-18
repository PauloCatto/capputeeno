import { Environment } from '../models/product.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api-capputeeno-theta.vercel.app',
  featureFlags: {
    enableGraphQLApi: false,
  },
};
