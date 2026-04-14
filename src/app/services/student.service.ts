import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, CreateStudent, UpdateStudent, StudentProfile } from '../models/student.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = `${environment.apiUrl}/Students`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Student[]> { return this.http.get<Student[]>(this.apiUrl); }
  getById(id: number): Observable<Student> { return this.http.get<Student>(`${this.apiUrl}/${id}`); }
  getMyProfile(): Observable<StudentProfile> { return this.http.get<StudentProfile>(`${this.apiUrl}/my-profile`); }
  create(s: CreateStudent): Observable<Student> { return this.http.post<Student>(this.apiUrl, s); }
  update(id: number, s: UpdateStudent): Observable<Student> { return this.http.put<Student>(`${this.apiUrl}/${id}`, s); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
