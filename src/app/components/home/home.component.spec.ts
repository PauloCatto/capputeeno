import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({ selector: 'app-header', template: '' })
class MockHeaderComponent {
  @Output() searchResults = new EventEmitter<any>();
}

@Component({ selector: 'app-catalog', template: '' })
class MockCatalogComponent {
  @Input() filtered: any;
}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockHeaderComponent,
        MockCatalogComponent,
        MockFooterComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatSnackBarModule
      ],
      providers: [ToastService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update filteredProducts when updateFilteredProducts is called', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Produto 1',
        description: 'Descrição do Produto 1',
        price_in_cents: 1000,
        image_url: 'https://example.com/produto1.jpg'
      }
    ];
    component.updateFilteredProducts(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
  });
});
