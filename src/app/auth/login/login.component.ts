import { Component, DestroyRef, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  destroyRef = inject(DestroyRef);
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { };

  public loginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  public submitForm(): void {
    this.userService
      .login(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => {
          console.log(error);
        }
      });
  }
}
