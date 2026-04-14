export interface Department { id: number; name: string; description: string; location: string; managerName: string; studentsCount: number; instructorsCount: number; coursesCount: number; }
export interface DepartmentResponse { total: number; page: number; pageSize: number; data: Department[]; }
export interface CreateDepartment { dept_Name: string; dept_Desc: string; dept_Location: string; dept_Manager?: number | null; }
export interface UpdateDepartment { dept_Name: string; dept_Desc: string; dept_Location: string; dept_Manager?: number | null; }
