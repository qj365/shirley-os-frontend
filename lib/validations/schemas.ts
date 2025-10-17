import { z } from 'zod';

// Send OTP validation schema
export const sendOtpSchema = z.object({
  email: z.email('Email invalid').nonempty('This field is required'),
});

// Verify OTP validation schema
export const verifyOtpSchema = z.object({
  email: z.email('Email invalid').nonempty('This field is required'),
  otp: z
    .string()
    .trim()
    .nonempty('This field is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

// Signup validation schema
export const signupSchema = z.object({
  token: z.string().nonempty('This field is required'),
  firstName: z
    .string()
    .trim()
    .nonempty('This field is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .trim()
    .nonempty('This field is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  password: z
    .string()
    .nonempty('This field is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  phoneNumber: z
    .string()
    .trim()
    .nonempty('This field is required')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .min(8, 'Phone number must be at least 8 characters')
    .max(20, 'Phone number must be less than 20 characters'),
});

// Password reset validation schema
export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .nonempty('This field is required')
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be less than 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().nonempty('This field is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Change password validation schema
export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty('This field is required')
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be less than 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().nonempty('This field is required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Type exports
export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
