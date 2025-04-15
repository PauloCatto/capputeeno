import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { ToastService } from 'src/app/services/toast/toast.service';

import { CatalogComponent } from './catalog.component';

import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let service: CatalogService;
  let httpMock: HttpTestingController;
  let router: Router;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CatalogComponent],
      providers: [
        CatalogService,
        ToastService,
        {
          provide: MatDialog,
          useValue: { open: jasmine.createSpy('open') },
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(CatalogService);
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    component = TestBed.createComponent(CatalogComponent).componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch products and process them correctly when data is returned', fakeAsync(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price_in_cents: 1000,
          image_url: 'url1',
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          price_in_cents: 2000,
          image_url: 'url2',
        },
      ];

      spyOn(service, 'getProducts').and.returnValue(
        Promise.resolve(mockProducts)
      );

      component.ngOnInit();

      tick();

      expect(component.products).toEqual(mockProducts);
      expect(component.tabs.length).toBe(3);
    }));

    it('should log an error message if no products are returned', fakeAsync(() => {
      spyOn(service, 'getProducts').and.returnValue(Promise.resolve([]));

      const consoleErrorSpy = spyOn(console, 'error');

      component.ngOnInit();

      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith('NO_PRODUCTS_FOUND');
    }));
    it('should handle errors from the API correctly', fakeAsync(() => {
      const error = 'API error';
      spyOn(translate, 'instant').and.callThrough();

      spyOn(service, 'getProducts').and.returnValue(Promise.reject(error));

      component.ngOnInit();
      tick();
      expect(translate.instant).toHaveBeenCalledWith(
        'ERROR_FETCHING_PRODUCTS',
        error
      );
    }));
  });

  it('should fetch products from the API and populate the component', (done) => {
    const mockResponse = {
      data: {
        allProducts: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            price_in_cents: 1000,
            image_url: 'url1',
          },
          {
            id: 2,
            name: 'Product 2',
            description: 'Description 2',
            price_in_cents: 2000,
            image_url: 'url2',
          },
        ],
      },
    };

    service.getProducts().then((products) => {
      expect(products).toEqual(mockResponse.data.allProducts);
      done();
    });

    const req = httpMock.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call the router.navigate when a product is clicked', fakeAsync(() => {
    const product = {
      id: 1,
      name: 'Test Product',
      description: 'Test description',
      price_in_cents: 1000,
      image_url: 'url1',
    };

    component.onProductClick(product);

    tick(2000);

    expect(router.navigate).toHaveBeenCalledWith(['/product']);
  }));

  describe('changeItemsPerPage', () => {
    it('should increase itemsPerPage by step and call onItemsPerPageChange if within range', () => {
      component.itemsPerPage = 10;

      component.onItemsPerPageChange = jasmine.createSpy();

      component.changeItemsPerPage(5);

      expect(component.itemsPerPage).toBe(15);
      expect(component.onItemsPerPageChange).toHaveBeenCalledWith(15);
    });

    it('should not change itemsPerPage if new value is below 10', () => {
      component.itemsPerPage = 10;

      component.changeItemsPerPage(-5);

      expect(component.itemsPerPage).toBe(10);
    });

    it('should not change itemsPerPage if new value is above 60', () => {
      component.itemsPerPage = 60;

      component.changeItemsPerPage(5);

      expect(component.itemsPerPage).toBe(60);
    });
  });

  describe('selectTab', () => {
    it('should set selectedTab to the provided index', () => {
      component.selectTab(1);

      expect(component.selectedTab).toBe(1);
    });
  });

  describe('onItemsPerPageChange', () => {
    it('should update each tab with dataToShow sliced according to the new value', () => {
      component.tabs = [
        {
          label: 'ALL_PRODUCTS',
          data: Array(50).fill({ name: 'Test Product' }),
          dataToShow: [],
        },
        {
          label: 'TSHIRTS',
          data: Array(30).fill({ name: 'Camiseta' }),
          dataToShow: [],
        },
        {
          label: 'MUGS',
          data: Array(20).fill({ name: 'Caneca' }),
          dataToShow: [],
        },
      ];

      component.onItemsPerPageChange(10);

      expect(component.tabs?.[0]?.dataToShow?.length ?? 0).toBe(10);
      expect(component.tabs?.[1]?.dataToShow?.length ?? 0).toBe(10);
      expect(component.tabs?.[2]?.dataToShow?.length ?? 0).toBe(10);
    });
  });
});
