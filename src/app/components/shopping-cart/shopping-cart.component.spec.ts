import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Product } from 'src/app/models/product.interface';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProducts = [
    {
      id: 1,
      name: 'Product 1',
      quantity: 1,
      price: 10,
      description: 'Description 1',
      price_in_cents: 1000,
      image_url: 'url1',
    },
    {
      id: 2,
      name: 'Product 2',
      quantity: 2,
      price: 20,
      description: 'Description 2',
      price_in_cents: 2000,
      image_url: 'url2',
    },
    {
      id: 3,
      name: 'Product 3',
      quantity: 3,
      price: 30,
      description: 'Description 3',
      price_in_cents: 3000,
      image_url: 'url3',
    },
  ];

  beforeEach(async () => {
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const cartSpy = jasmine.createSpyObj('CartService', [
      'getProducts',
      'getTotalQuantity',
      'getTotalPrice',
      'updateCart',
      'clearCart',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const translateSpyObj = jasmine.createSpyObj('TranslateService', [
      'get',
      'instant',
    ]);

    cartSpy.getProducts.and.returnValue([...mockProducts]);
    cartSpy.getTotalQuantity.and.returnValue(6);
    cartSpy.getTotalPrice.and.returnValue(140);

    translateSpyObj.get.and.callFake((key: string) => of(key));
    translateSpyObj.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: CartService, useValue: cartSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.products = [...mockProducts];
    component.updateCartStatus();
    fixture.detectChanges();
  });

  it('should open confirmation dialog and remove item if confirmed', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of(true),
      close: () => {},
    });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.removeItem(component.products[0]);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.products.length).toBe(mockProducts.length - 1);
    expect(cartServiceSpy.updateCart).toHaveBeenCalledWith(component.products);
  });

  it('should finish purchase, show dialog and clear cart after timeout', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      close: jasmine.createSpy('close'),
    });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.finishPurchase();
    tick(1000);

    expect(dialogSpy.open).toHaveBeenCalled();

    tick(5000);

    expect(dialogRefSpyObj.close).toHaveBeenCalled();
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loading).toBeFalse();
  }));

  it('should update hasFewProducts correctly', () => {
    component.products = [
      {
        id: 1,
        name: 'Product 1',
        quantity: 1,
        description: 'Description 1',
        price_in_cents: 1000,
        image_url: 'url1',
      },
      {
        id: 2,
        name: 'Product 2',
        quantity: 2,
        description: 'Description 2',
        price_in_cents: 2000,
        image_url: 'url2',
      },
    ];
    component.updateCartStatus();
    expect(component.hasFewProducts).toBeTrue();

    component.products = [
      {
        id: 1,
        name: 'Product 1',
        quantity: 1,
        description: 'Description 1',
        price_in_cents: 1000,
        image_url: 'url1',
      },
      {
        id: 2,
        name: 'Product 2',
        quantity: 1,
        description: 'Description 2',
        price_in_cents: 2000,
        image_url: 'url2',
      },
      {
        id: 3,
        name: 'Product 3',
        quantity: 1,
        description: 'Description 3',
        price_in_cents: 3000,
        image_url: 'url3',
      },
    ];
    component.updateCartStatus();
    expect(component.hasFewProducts).toBeFalse();

    component.products = [];
    component.updateCartStatus();
    expect(component.hasFewProducts).toBeTrue();
  });

  it('should increase quantity of product and update cart', () => {
    const product = {
      id: 1,
      name: 'Test',
      quantity: 1,
      price: 100,
    } as unknown as Product & { quantity: number };
    component.products = [product];
    spyOn(component, 'updateCartStatus');

    component.increaseQuantity(product);

    expect(product.quantity).toBe(2);
    expect(cartServiceSpy.updateCart).toHaveBeenCalledWith(component.products);
    expect(component.updateCartStatus).toHaveBeenCalled();
  });

  it('should decrease quantity if quantity > 1', () => {
    const product = {
      id: 1,
      name: 'Test',
      quantity: 2,
      price: 100,
    } as unknown as Product & { quantity: number };
    component.products = [product];
    spyOn(component, 'updateCartStatus');
    spyOn(component, 'removeItem');

    component.decreaseQuantity(product);

    expect(product.quantity).toBe(1);
    expect(cartServiceSpy.updateCart).toHaveBeenCalledWith(component.products);
    expect(component.updateCartStatus).toHaveBeenCalled();
    expect(component.removeItem).not.toHaveBeenCalled();
  });

  it('should remove item if quantity == 1 and decreaseQuantity called', () => {
    const product = {
      id: 1,
      name: 'Test',
      quantity: 1,
      price: 100,
    } as unknown as Product & { quantity: number };
    component.products = [product];
    spyOn(component, 'updateCartStatus');
    spyOn(component, 'removeItem');

    component.decreaseQuantity(product);

    expect(component.removeItem).toHaveBeenCalledWith(product);
    expect(cartServiceSpy.updateCart).not.toHaveBeenCalled();
    expect(component.updateCartStatus).not.toHaveBeenCalled();
  });
});
