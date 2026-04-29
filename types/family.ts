// types/family.ts
export interface FamilyMember {
  id: string;
  email: string;
  full_name: string;
  age: number;
  family_branch: string;
  employment_status: EmploymentStatus;
  marital_status: MaritalStatus;
  graduate_status: GraduateStatus;
  location: string;
  address: string;
  phone_number: string;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export type EmploymentStatus = 
  | 'employed'
  | 'self-employed'
  | 'unemployed'
  | 'student'
  | 'retired'
  | 'homemaker';

export type MaritalStatus = 
  | 'single'
  | 'married'
  | 'divorced'
  | 'widowed'
  | 'separated';

export type GraduateStatus = 
  | 'high-school'
  | 'undergraduate'
  | 'graduate'
  | 'post-graduate'
  | 'none';

export interface ActivityLogEntry {
  id: number;
  user_id: string;
  action: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
}

export interface RegisterFormData {
  full_name: string;
  age: string;
  family_branch: string;
  employment_status: EmploymentStatus;
  marital_status: MaritalStatus;
  graduate_status: GraduateStatus;
  location: string;
  address: string;
  phone_number: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo: File | null;
}

export interface ProfileFormData {
  full_name: string;
  age: number;
  family_branch: string;
  employment_status: EmploymentStatus;
  marital_status: MaritalStatus;
  graduate_status: GraduateStatus;
  location: string;
  address: string;
  phone_number: string;
}