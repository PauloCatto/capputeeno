import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [ToastService, { provide: MatSnackBar, useValue: spy }],
    });

    service = TestBed.inject(ToastService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call MatSnackBar.open with success config', () => {
    service.showSuccess('Operação bem-sucedida');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Operação bem-sucedida',
      'X',
      {
        duration: 2000,
        panelClass: ['toast-success'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      }
    );
  });

  it('should call MatSnackBar.open with error config', () => {
    service.showError('Algo deu errado');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Algo deu errado', 'X', {
      duration: 4000,
      panelClass: ['toast-error'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  });
});
