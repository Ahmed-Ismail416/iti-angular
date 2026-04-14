import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let cloned = req;
  if (token) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(cloned).pipe(
    catchError(err => {
      if (err.status === 401) {
        const currentUrl = router.url;
        if (!currentUrl.startsWith('/login') && !currentUrl.startsWith('/register')) {
          localStorage.clear();
          router.navigate(['/login']);
        }
      }
      return throwError(() => err);
    })
  );
};
