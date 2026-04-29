import { describe, it, expect } from 'vitest';
import { 
  registerSchema, 
  loginSchema, 
  profileSchema,
  passwordResetSchema 
} from '../lib/validations';

describe('registerSchema', () => {
  it('should validate a valid registration', () => {
    const validData = {
      full_name: 'John Doe',
      age: '25',
      family_branch: 'Okorocha',
      employment_status: 'employed',
      marital_status: 'single',
      graduate_status: 'graduate',
      location: 'Lagos',
      address: '123 Main St',
      phone_number: '+2348012345678',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    const invalidData = {
      full_name: 'John Doe',
      age: '25',
      family_branch: 'Okorocha',
      employment_status: 'employed',
      marital_status: 'single',
      graduate_status: 'graduate',
      location: 'Lagos',
      address: '123 Main St',
      phone_number: '+2348012345678',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword',
    };
    
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      full_name: 'John Doe',
      age: '25',
      family_branch: 'Okorocha',
      employment_status: 'employed',
      marital_status: 'single',
      graduate_status: 'graduate',
      location: 'Lagos',
      address: '123 Main St',
      phone_number: '+2348012345678',
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123',
    };
    
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const invalidData = {
      full_name: 'John Doe',
      age: '25',
      family_branch: 'Okorocha',
      employment_status: 'employed',
      marital_status: 'single',
      graduate_status: 'graduate',
      location: 'Lagos',
      address: '123 Main St',
      phone_number: '+2348012345678',
      email: 'john@example.com',
      password: '123',
      confirmPassword: '123',
    };
    
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should validate valid login credentials', () => {
    const validData = {
      email: 'john@example.com',
      password: 'password123',
    };
    
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
    };
    
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('should validate valid profile data', () => {
    const validData = {
      full_name: 'John Doe',
      age: 25,
      family_branch: 'Okorocha',
      employment_status: 'employed',
      marital_status: 'single',
      graduate_status: 'graduate',
      location: 'Lagos',
      address: '123 Main St',
      phone_number: '+2348012345678',
    };
    
    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid age', () => {
    const invalidData = {
      full_name: 'John Doe',
      age: 150,
      family_branch: 'Okorocha',
      employment_status: 'employed',
      marital_status: 'single',
      graduate_status: 'graduate',
      location: 'Lagos',
      address: '123 Main St',
      phone_number: '+2348012345678',
    };
    
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('passwordResetSchema', () => {
  it('should validate valid email', () => {
    const validData = { email: 'john@example.com' };
    const result = passwordResetSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = { email: 'invalid-email' };
    const result = passwordResetSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});