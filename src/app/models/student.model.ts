export interface Student { id: number; fullName: string; address: string; age: number; departmentName: string; departmentId: number; email: string; }
export interface CreateStudent { st_Fname: string; st_Lname: string; st_Address: string; st_Age: number; departmentId: number; email: string; password: string; }
export interface UpdateStudent { st_Fname: string; st_Lname: string; st_Address: string; st_Age: number; departmentId: number; }
export interface StudentProfile { id: number; fullName: string; email: string; address: string; age: number; departmentId: number; departmentName: string; departmentDescription: string; departmentLocation: string; courses: any[]; }
