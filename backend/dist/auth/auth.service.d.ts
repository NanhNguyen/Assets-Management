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
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyAccess(token: string): any;
}
