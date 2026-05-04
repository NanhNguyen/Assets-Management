import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | undefined;
            role: any;
        };
    }>;
    refresh(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    createUser(req: any, userData: any): Promise<{
        success: boolean;
        message: string;
        user: import("@supabase/auth-js").User;
    }>;
    listUsers(): Promise<any[]>;
    updateRole(body: {
        userId: string;
        role: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(body: {
        userId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(req: any): any;
}
