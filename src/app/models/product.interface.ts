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
