import { Component, HostListener, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetForm: FormGroup = this.fb.group({
    token: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  step = 1; // 1 = Request, 2 = Reset
  errorMessage: string | null = null;
  successMessage: string | null = null;
  demoToken: string | null = null;
  isLoading = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onRequestToken() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const email = this.emailForm.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        if (res.demoToken) {
          this.demoToken = res.demoToken;
          this.resetForm.patchValue({ token: res.demoToken });
        }
        this.step = 2;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al procesar la solicitud.';
      }
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { token, password } = this.resetForm.value;
    this.authService.resetPassword(token, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = '¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al restablecer la contraseña.';
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
