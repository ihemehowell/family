// lib/validations.ts
import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().min(1, 'Enter a valid age').max(120, 'Age must be less than 120'),
  family_branch: z.string().min(1, 'Family branch is required'),
  employment_status: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired', 'homemaker'], {
    errorMap: () => ({ message: 'Select employment status' }),
  }),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed', 'separated'], {
    errorMap: () => ({ message: 'Select marital status' }),
  }),
  graduate_status: z.enum(['high-school', 'undergraduate', 'graduate', 'post-graduate', 'none'], {
    errorMap: () => ({ message: 'Select graduate status' }),
  }),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  phone_number: z.string().regex(/^\+?\d{7,15}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().min(1, 'Enter a valid age').max(120, 'Age must be less than 120'),
  family_branch: z.string().min(1, 'Family branch is required'),
  employment_status: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired', 'homemaker']),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed', 'separated']),
  graduate_status: z.enum(['high-school', 'undergraduate', 'graduate', 'post-graduate', 'none']),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  phone_number: z.string().regex(/^\+?\d{7,15}$/, 'Enter a valid phone number'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;