import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/models/product.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockCartService {
  updateCart = jasmine.createSpy('updateCart');
}

class MockToastService {
  showSuccess = jasmine.createSpy('showSuccess');
}

class MockTranslateService {
  instant(key: string) {
    return key;
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let cartService: MockCartService;
  let toastService: MockToastService;
  let router: MockRouter;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [
        { provide: CartService, useClass: MockCartService },
        { provide: ToastService, useClass: MockToastService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: Router, useClass: MockRouter },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
    toastService = TestBed.inject(ToastService) as unknown as MockToastService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    spyOn(console, 'error');
    localStorage.clear();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product from localStorage on init', () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price_in_cents: 1000,
      image_url: 'test.jpg',
    };
    localStorage.setItem('selectedProduct', JSON.stringify(product));

    component.ngOnInit();

    expect(component.product).toEqual(product);
  });

  it('should log an error if no product is found in localStorage', () => {
    localStorage.removeItem('selectedProduct');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('NO_PRODUCT_IN_STORAGE');
  });

  it('should increment quantity if product already exists in cart', fakeAsync(() => {
    const mockProduct: Product = {
      id: 1,
      name: 'Produto Existente',
      price_in_cents: 1000,
      image_url: '',
      description: '',
    };

    const existingCart = [{ ...mockProduct, quantity: 2 }];
    localStorage.setItem('selectedProducts', JSON.stringify(existingCart));

    component.product = mockProduct;
    component.addToCart(mockProduct);

    tick(3000);
    tick(2100);

    const updatedCart = JSON.parse(localStorage.getItem('selectedProducts')!);

    expect(updatedCart.length).toBe(1);
    expect(updatedCart[0].id).toBe(1);
    expect(updatedCart[0].quantity).toBe(3);
  }));

  it('should add new product with quantity 1 if it does not exist in cart', fakeAsync(() => {
    const mockProduct: Product = {
      id: 2,
      name: 'Produto Novo',
      price_in_cents: 2000,
      image_url: '',
      description: '',
    };

    localStorage.setItem('selectedProducts', JSON.stringify([]));

    component.product = mockProduct;
    component.addToCart(mockProduct);

    tick(3000);
    tick(2100);

    const updatedCart = JSON.parse(localStorage.getItem('selectedProducts')!);

    expect(updatedCart.length).toBe(1);
    expect(updatedCart[0].id).toBe(2);
    expect(updatedCart[0].quantity).toBe(1);
  }));
});
