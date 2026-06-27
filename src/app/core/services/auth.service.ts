import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'CLIENT' | 'DRIVER';
  status: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private platformId = inject(PLATFORM_ID);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('movex_user');
      if (userJson) {
        try {
          this.currentUserSubject.next(JSON.parse(userJson));
        } catch {
          this.logout();
        }
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('movex_access_token', response.accessToken);
          localStorage.setItem('movex_refresh_token', response.refreshToken);
          localStorage.setItem('movex_user', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('movex_access_token');
      localStorage.removeItem('movex_refresh_token');
      localStorage.removeItem('movex_user');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('movex_access_token') : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}
