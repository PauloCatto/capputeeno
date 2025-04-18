import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from 'src/app/models/product.interface';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Camiseta Angular',
    description: 'Estilosa',
    price_in_cents: 5000,
    image_url: 'url',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    service.addProduct(mockProduct);
    const products = service.getProducts();
    expect(products.length).toBe(1);
    expect(products[0].quantity).toBe(1);
    expect(products[0].id).toBe(mockProduct.id);
  });

  it('should increment quantity if same product is added again', () => {
    service.addProduct(mockProduct);
    service.addProduct(mockProduct);
    const products = service.getProducts();
    expect(products.length).toBe(1);
    expect(products[0].quantity).toBe(2);
  });

  it('should return correct total quantity', () => {
    service.addProduct(mockProduct);
    service.addProduct(mockProduct);
    expect(service.getTotalQuantity()).toBe(2);
  });

  it('should return correct total price', () => {
    service.addProduct(mockProduct);
    service.addProduct(mockProduct);
    expect(service.getTotalPrice()).toBe(100);
  });

  it('should update the cart with new products', () => {
    const newProducts = [
      { ...mockProduct, quantity: 3 },
      { ...mockProduct, id: 2, price_in_cents: 2000, quantity: 1 },
    ];
    service.updateCart(newProducts);
    const products = service.getProducts();
    expect(products.length).toBe(2);
    expect(products[0].quantity).toBe(3);
  });

  it('should clear the cart', () => {
    service.addProduct(mockProduct);
    service.clearCart();
    const products = service.getProducts();
    expect(products.length).toBe(0);
    expect(localStorage.getItem('selectedProducts')).toBeNull();
  });
});
