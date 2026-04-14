export interface Course { id: number; name: string; duration: number; departmentName: string; departmentId: number; }
export interface CreateCourse { crs_Name: string; crs_Duration: number; departmentId: number; }
export interface UpdateCourse { crs_Name: string; crs_Duration: number; departmentId: number; }
