import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartComponent } from './shopping-cart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../header/header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from '../footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent, HeaderComponent, FooterComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
