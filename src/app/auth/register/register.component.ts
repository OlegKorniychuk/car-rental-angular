import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  destroyRef = inject(DestroyRef);
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { };

  public registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    surname: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  },
    {
      validators: this.matchPasswords
    });

  public submitForm(): void {
    this.userService
      .register(this.registerForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => {
          console.log(error);
        }
      });
  }

  private matchPasswords(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMissmatch: true }
  }
}
