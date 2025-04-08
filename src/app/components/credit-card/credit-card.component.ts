import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  checkoutForm!: FormGroup;
  isFlipped = false;
  selectedPaymentMethod = 'pix';
  totalAmount = 1000; // valor total fictício, pode vir da API
  installments = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      number: [''],
      holder: [''],
      expiry: [''],
      cvv: [''],
      name: [''],
      email: [''],
      address: [''],
      city: [''],
      zip: [''],
      paymentMethod: ['pix'],
      installments: [1]
    });
  }

  get cardForm() {
    return this.checkoutForm;
  }

  onCardNumberChange(): void {
    const value = this.checkoutForm.get('number')?.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    this.checkoutForm.patchValue({ number: value });
  }

  flipCard(flip: boolean): void {
    this.isFlipped = flip;
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
      console.log('Dados enviados:', this.checkoutForm.value);
    }
  }
}
