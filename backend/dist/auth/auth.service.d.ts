import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
export declare class AuthService {
    private jwtService;
    private supabaseService;
    private readonly jwtSecret;
    private readonly refreshSecret;
    constructor(jwtService: JwtService, supabaseService: SupabaseService);
    login(email: string, pass: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | undefined;
            role: any;
        };
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyAccess(token: string): any;
    registerByAdmin(adminId: string, userData: {
        email: string;
        password: string;
        fullName: string;
        role: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: import("@supabase/auth-js").User;
    }>;
    getAllUsers(): Promise<any[]>;
    updateUserRole(userId: string, newRole: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
