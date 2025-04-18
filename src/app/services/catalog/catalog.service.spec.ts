import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CatalogService } from './catalog.service';
import { environment } from 'src/app/environments/environment';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogService]
    });

    service = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products using GraphQL when feature flag is enabled', async () => {
    environment.featureFlags.enableGraphQLApi = true;

    const mockResponse = {
      data: {
        allProducts: [
          { id: 1, name: 'Produto 1', description: '...', price_in_cents: 1000, image_url: 'img.png' }
        ]
      }
    };

    const promise = service.getProducts();

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.query).toContain('allProducts');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse.data.allProducts);
  });

  it('should fetch products using REST when feature flag is disabled', async () => {
    environment.featureFlags.enableGraphQLApi = false;

    const mockResponse = {
      products: [
        { id: 2, name: 'Produto 2', description: '...', price_in_cents: 2000, image_url: 'img2.png' }
      ]
    };

    const promise = service.getProducts();

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse.products);
  });

  it('should throw an error when request fails', async () => {
    environment.featureFlags.enableGraphQLApi = false;

    const promise = service.getProducts();

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    req.error(new ErrorEvent('Network error'));

    await expectAsync(promise).toBeRejected();
  });
});
