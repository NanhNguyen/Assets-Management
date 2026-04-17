import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
