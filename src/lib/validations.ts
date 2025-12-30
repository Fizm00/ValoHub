import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, { message: "Password is required" })
});

export const RegisterSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ProfileSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
}).refine((data) => {
    // If newPassword is provided, currentPassword is required (often backend logic, but good to check presence)
    if (data.newPassword && data.newPassword.length > 0) {
        return !!data.currentPassword && data.currentPassword.length > 0;
    }
    return true;
}, {
    message: "Current password is required to change password",
    path: ["currentPassword"],
}).refine((data) => {
    if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword.length >= 8 && /[0-9]/.test(data.newPassword);
    }
    return true;
}, {
    message: "New password must be at least 8 characters and contain a number",
    path: ["newPassword"]
});

export const SquadSchema = z.object({
    squadName: z.string().min(3, { message: "Squad name must be at least 3 characters" })
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type ProfileFormValues = z.infer<typeof ProfileSchema>;
export type SquadFormValues = z.infer<typeof SquadSchema>;
