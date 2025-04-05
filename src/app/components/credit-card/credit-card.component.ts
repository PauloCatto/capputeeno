import { Component } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {
  cardNumber: string = '';
  cardHolder: string = '';
  cardExpiry: string = '';
  cvv: string = '';
  isFlipped: boolean = false;

  onCardNumberChange(): void {
    this.cardNumber = this.cardNumber.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  flipCard(flip: boolean): void {
    this.isFlipped = flip;
  }

}
