import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'X', {
      duration: 2000,
      panelClass: ['toast-success'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'X', {
      duration: 4000,
      panelClass: ['toast-error'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
