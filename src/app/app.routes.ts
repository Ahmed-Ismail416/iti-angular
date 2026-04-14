import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CoursesComponent } from './components/courses/courses.component';
import { DepartmentCoursesComponent } from './components/department-courses/department-courses.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [adminGuard] },
  { path: 'departments', component: DepartmentsComponent, canActivate: [adminGuard] },
  { path: 'departments/:id/courses', component: DepartmentCoursesComponent, canActivate: [adminGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [adminGuard] },
  { path: 'student-home', component: StudentHomeComponent, canActivate: [authGuard] },
  { path: 'student-profile', component: StudentProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
