import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<string | null>(this.getStoredName());

  isLoggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('fullName', res.fullName);
        localStorage.setItem('email', res.email);
        localStorage.setItem('expiration', res.expiration);
        localStorage.setItem('role', res.role);
        if (res.studentId) localStorage.setItem('studentId', res.studentId.toString());
        this.loggedIn.next(true);
        this.currentUser.next(res.fullName);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  readToken(): string | null { return localStorage.getItem('token'); }
  getStoredName(): string | null { return localStorage.getItem('fullName'); }
  getStoredEmail(): string | null { return localStorage.getItem('email'); }
  getRole(): string { return localStorage.getItem('role') || ''; }
  getStudentId(): number | null { const id = localStorage.getItem('studentId'); return id ? +id : null; }
  isAdmin(): boolean { return this.getRole() === 'Admin'; }
  isStudent(): boolean { return this.getRole() === 'Student'; }
  hasToken(): boolean { return !!localStorage.getItem('token'); }

  isAuthenticated(): boolean {
    const token = this.readToken();
    if (!token) return false;
    const exp = localStorage.getItem('expiration');
    if (exp && new Date(exp) < new Date()) { this.logout(); return false; }
    return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('expiration');
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }
}
