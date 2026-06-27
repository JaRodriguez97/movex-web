import { Component, HostListener, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string | null = null;
  isLoading = false;
  showPassword = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Acceso denegado: El panel web es de uso exclusivo para Administradores. Por favor inicia sesión desde la aplicación móvil.';
          this.authService.logout();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const glow = document.querySelector('.gradient-mesh') as HTMLElement;
    if (glow) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glow.style.background = `radial-gradient(at ${x}% ${y}%, rgba(197, 246, 237, 0.12) 0%, transparent 50%),
                                radial-gradient(at 100% 100%, rgba(0, 0, 0, 1) 0%, transparent 50%)`;
    }
  }
}
