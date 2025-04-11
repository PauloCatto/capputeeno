import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit {
  checkoutForm!: FormGroup;
  selectedPaymentMethod: string = 'credit';
  totalAmount: number = 0;
  installments = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(private fb: FormBuilder, private cartService: CartService) {}

  ngOnInit(): void {
    this.totalAmount = this.cartService.getTotalPrice();

    this.checkoutForm = this.fb.group({
      holder: ['', Validators.required],
      number: [
        '',
        [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)],
      ],
      expiry: ['', Validators.required, Validators.pattern(/^\d{4}$/)
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      paymentMethod: ['credit'],
      installments: [1],
    });

    this.selectedPaymentMethod = this.checkoutForm.get('paymentMethod')?.value;
  }

  onCardNumberChange(): void {
    const rawValue = this.checkoutForm.get('number')?.value.replace(/\D/g, '');
    const formatted = rawValue.replace(/(.{4})/g, '$1 ').trim();
    this.checkoutForm.patchValue({ number: formatted }, { emitEvent: false });
  }

  onPaymentMethodChange(): void {
    this.selectedPaymentMethod = this.checkoutForm.get('paymentMethod')?.value;
    if (this.selectedPaymentMethod !== 'credit') {
      this.checkoutForm.patchValue({ installments: 1 });
    }
  }

  getInstallmentValue(i: number): number {
    return this.totalAmount / i;
  }

  submit(): void {
    if (this.checkoutForm.valid) {
      console.log('✅ Pagamento enviado:', this.checkoutForm.value);
    } else {
      console.warn('❌ Formulário inválido!');
      this.checkoutForm.markAllAsTouched();
    }
  }
}
