import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLogin = true;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router  
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

login() {
  /*
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Store token
        console.log('Login successful:', response);
        this.router.navigate(['/home']); // Navigate to home page
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  } else {
    console.error('Form is not valid');
  }
  */
  this.router.navigate(['/home']); // Navigate to home page
}
register() {
  if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }
}

toggleForm() {
  this.isLogin = !this.isLogin;
}

}
