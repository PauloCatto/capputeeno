import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ProductComponent } from './product.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject } from 'rxjs';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  class MockCartService {
    cart$ = new BehaviorSubject<any[]>([]);
    updateCart(cart: any[]) {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent, HeaderComponent, FooterComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatSnackBarModule,
        MatMenuModule,
      ],
      providers: [
        ToastService,
        { provide: CartService, useValue: MockCartService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
