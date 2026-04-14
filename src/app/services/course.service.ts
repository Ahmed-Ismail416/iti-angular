import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateCourse, UpdateCourse } from '../models/course.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = `${environment.apiUrl}/Course`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Course[]> { return this.http.get<Course[]>(this.apiUrl); }
  getById(id: number): Observable<Course> { return this.http.get<Course>(`${this.apiUrl}/${id}`); }
  getByDepartment(deptId: number): Observable<Course[]> { return this.http.get<Course[]>(`${this.apiUrl}/by-department/${deptId}`); }
  create(c: CreateCourse): Observable<Course> { return this.http.post<Course>(this.apiUrl, c); }
  update(id: number, c: UpdateCourse): Observable<Course> { return this.http.put<Course>(`${this.apiUrl}/${id}`, c); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
