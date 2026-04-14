import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, DepartmentResponse, CreateDepartment, UpdateDepartment } from '../models/department.model';
import { Course } from '../models/course.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/Department`;
  constructor(private http: HttpClient) {}
  getAll(page: number = 1, pageSize: number = 100, search: string = ''): Observable<DepartmentResponse> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<DepartmentResponse>(this.apiUrl, { params });
  }
  getById(id: number): Observable<Department> { return this.http.get<Department>(`${this.apiUrl}/${id}`); }
  getCourses(id: number): Observable<Course[]> { return this.http.get<Course[]>(`${this.apiUrl}/${id}/courses`); }
  create(d: CreateDepartment): Observable<any> { return this.http.post(this.apiUrl, d); }
  update(id: number, d: UpdateDepartment): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, d); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
