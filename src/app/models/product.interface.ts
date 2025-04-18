export interface Product {
  id: number;
  name: string;
  description: string;
  price_in_cents: number;
  image_url: string;
}

export interface Tab {
  label: string;
  data: Product[];
  dataToShow?: Product[];
}

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

export interface Environment {
  production: boolean;
  apiUrl: string;
  featureFlags: {
    enableGraphQLApi: boolean;
  };
}
