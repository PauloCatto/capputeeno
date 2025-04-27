import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from 'src/app/models/product.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const onLangChangeSubject = new Subject();

  const mockTranslate = {
    get: jasmine.createSpy('get').and.callFake((key: string) => of(key)),
    use: jasmine.createSpy('use').and.returnValue(of(null)),
    instant: (key: string) => key,
    setDefaultLang: jasmine.createSpy('setDefaultLang'),
    currentLang: 'en',
    onLangChange: onLangChangeSubject.asObservable(),
    onTranslationChange: of(),
    onDefaultLangChange: of(),
  };

  const cartQuantity$ = new Subject<number>();
  const mockCartService = {
    totalQuantity$: cartQuantity$.asObservable(),
  };

  const mockCatalogService = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(
      Promise.resolve([
        {
          id: 1,
          name: 'Cool Shirt',
          description: 'A cool shirt',
          price_in_cents: 2000,
          image_url: 'cool-shirt.jpg',
        },
        {
          id: 2,
          name: 'Mug',
          description: 'A nice mug',
          price_in_cents: 1500,
          image_url: 'mug.jpg',
        },
      ] as Product[])
    ),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    url: '/',
  };

  const mockToast = {
    showError: jasmine.createSpy('showError'),
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.returnValue('en');
    spyOn(localStorage, 'setItem');

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule,
        MatMenuModule,
      ],
      providers: [
        { provide: TranslateService, useValue: mockTranslate },
        { provide: CartService, useValue: mockCartService },
        { provide: CatalogService, useValue: mockCatalogService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToast },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize language from localStorage', () => {
    expect(mockTranslate.use).toHaveBeenCalledWith('en');
    expect(component.currentLang).toBe('en');
  });

  it('should subscribe to cart and update cartItemCount', () => {
    cartQuantity$.next(3);
    expect(component.cartItemCount).toBe(3);
  });

  it('should navigate to shopping-cart if cart has items', () => {
    component.cartItemCount = 2;
    component.validateCart();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/shopping-cart']);
  });

  it('should show error toast if cart is empty', () => {
    component.cartItemCount = 0;
    component.validateCart();
    expect(mockToast.showError).toHaveBeenCalledWith('cart_empty_message');
  });

  it('should emit filtered products after debounce on valid search', fakeAsync(() => {
    spyOn(component.searchResults, 'emit');
    component.searchControl.setValue('cool');
    tick(300);
    fixture.detectChanges();

    tick();
    expect(mockCatalogService.getProducts).toHaveBeenCalled();
    expect(component.searchResults.emit).toHaveBeenCalledWith([
      {
        id: 1,
        name: 'Cool Shirt',
        description: 'A cool shirt',
        price_in_cents: 2000,
        image_url: 'cool-shirt.jpg',
      },
    ]);
  }));

  it('should handle error when getProducts rejects', fakeAsync(() => {
    mockCatalogService.getProducts.and.returnValue(Promise.reject('Error!'));
    const consoleSpy = spyOn(console, 'error');

    component['searchProducts']('test');

    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Error!');
  }));

  it('should clear results if search input is too short', fakeAsync(() => {
    spyOn(component.searchResults, 'emit');
    component.searchControl.setValue('a');
    tick(300);
    fixture.detectChanges();

    expect(component.searchResults.emit).toHaveBeenCalledWith([]);
    expect(component.filteredProducts).toEqual([]);
  }));

  it('should toggle the dropdown', () => {
    expect(component.showDropdown).toBe(false);
    component.toggleDropdown();
    expect(component.showDropdown).toBe(true);
  });

  it('should switch language and store in localStorage', () => {
    component.switchLanguage('pt');
    expect(mockTranslate.use).toHaveBeenCalledWith('pt');
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'pt');
    expect(component.currentLang).toBe('pt');
  });
});
