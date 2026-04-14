export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; expiration: string; fullName: string; email: string; role: string; studentId: number | null; }
export interface RegisterRequest { fullName: string; email: string; password: string; departmentId: number; address: string; age: number; }
